# WCB Forms — Assignment 2 (Pug / Express version)

This is the Assignment 2 upgrade of the Assignment 1 static HTML/CSS/JS
project. The two WCB forms are now rendered **server-side with Pug**,
fed entirely by **simulated backend data** — nothing is typed on screen.

1. **Worker Progress Report** — `/worker-progress`
2. **Medical & Travel Expense Request** — `/medical-travel`

---

## Table of contents

- [How to run it (step by step)](#how-to-run-it-step-by-step)
- [Project structure](#project-structure)
- [How the "simulated backend" works](#how-the-simulated-backend-works)
- [Switching between the two data sets](#switching-between-the-two-data-sets)
- [Code modularity & reuse (the mixins)](#code-modularity--reuse-the-mixins)
- [Printing to a standard A4 PDF](#printing-to-a-standard-a4-pdf)
- [Assumptions made](#assumptions-made)
- [Challenges & how they were solved](#challenges--how-they-were-solved)
- [What to cover in the demo video](#what-to-cover-in-the-demo-video)

---

## How to run it (step by step)

You need **Node.js** installed (which comes with `npm`). Everything else
this project needs (Express, Pug) is installed by `npm install` below —
you do **not** need to install anything globally.

### 1. Install Node.js (skip if you already have it)

- Go to **https://nodejs.org** and download the **LTS** installer for your OS
  (Windows/macOS/Linux), or:
  - Windows/macOS: run the downloaded installer, click through with defaults.
  - macOS with Homebrew: `brew install node`
  - Linux (Debian/Ubuntu): `sudo apt update && sudo apt install nodejs npm`
- Confirm it worked by opening a terminal / command prompt and running:
  ```
  node -v
  npm -v
  ```
  You should see version numbers (Node 16 or newer is fine).

### 2. Unzip this project

Unzip `wcb-forms-pug.zip` anywhere on your machine, e.g. `Desktop\wcb-forms-pug`.

### 3. Install dependencies

Open a terminal, `cd` into the unzipped folder, then run:

```bash
cd wcb-forms-pug
npm install
```

This downloads Express and Pug into a local `node_modules` folder (only
needed once). You need an internet connection for this one step only.

### 4. Start the server

```bash
npm start
```

You should see:

```
WCB forms demo running at http://localhost:3000
```

### 5. Open it in your browser

Go to **http://localhost:3000**. You'll land on a menu linking to both
forms. Each form loads **Sample A** by default.

### 6. Switch data sets / print

- Use the **Sample A** / **Sample B** buttons in the toolbar to reload the
  page with a different simulated backend record.
- Click **Print / Save as PDF** (or press Ctrl/Cmd+P) and choose
  **Save as PDF** with paper size **A4** — the print stylesheet already
  targets A4 and hides the toolbar automatically.

### 7. Stop the server

Press `Ctrl+C` in the terminal where it's running.

### Optional: auto-restart on file changes while developing

```bash
npm install        # (nodemon is already listed as a devDependency)
npm run dev
```

---

## Project structure

```
wcb-forms-pug/
  server.js                     Express app + routes (the "controller" layer)
  package.json
  data/
    repository.js                Simulated backend "data access" layer
    worker-progress.json         2 sample claim records (Sample A / Sample B)
    medical-travel.json          2 sample claim records (Sample A / Sample B)
  config/
    expense-tables.js            Single source of truth: columns for all 6 expense tables
  utils/
    format.js                    Shared date/currency formatting helpers used in views
  views/
    layout.pug                   Shared page shell: head, toolbar, print button
    index.pug                    Landing page
    worker-progress.pug          3-page form, built from mixins + claim data
    medical-travel.pug           2-page form, 6 tables built from ONE mixin
    mixins/
      mixins.pug                 All reusable Pug mixins (see below)
  public/
    css/style.css                Shared stylesheet (screen + print/A4 rules)
    js/print.js                  The only client-side script: wires the Print button
    img/logo.svg                 Letterhead logo placeholder
```

**Why this split:** routes (`server.js`) only decide *which* backend record
to fetch and *which* view to render. The view layer (`views/`) only knows
how to lay a claim object out on the page. The data layer
(`data/repository.js`) is the only thing that "talks to the backend" —
swapping it for a real HTTP/DB call later would not require touching any
route or view.

---

## How the "simulated backend" works

`data/worker-progress.json` and `data/medical-travel.json` each hold two
full claim records, keyed `"A"` and `"B"` — exactly like rows you'd get
back from a real claims API or database table.

`data/repository.js` is the only module that reads those files. Routes in
`server.js` call `repository.getWorkerProgressRecord(sampleKey)` /
`repository.getMedicalTravelRecord(sampleKey)`, get back a plain claim
object, and hand it straight to the Pug view as `claim`. The view never
sees a file path or JSON — as far as it's concerned, `claim` just showed
up, the same way it would if `repository.js` were replaced by a real
`fetch()`/DB query tomorrow.

**No data entry anywhere:** every `<input>`, `<textarea>`, radio and
checkbox in both forms is rendered `disabled`. The person viewing the
page can never type into a field — they can only pick which backend
record to view.

---

## Switching between the two data sets

The toolbar's **Sample A** / **Sample B** buttons are plain links to
`?sample=A` / `?sample=B` on the current route. Clicking one asks the
**server** for a different record and re-renders the whole page from
scratch — it's a full round trip through `server.js` → `repository.js` →
Pug, exactly like navigating to a different claim in a real claims
system. This is intentionally not a client-side dropdown that edits the
DOM in place, since the brief asks for data to look like it's coming from
a backend.

- **Sample A** mirrors the values from the source PDFs.
- **Sample B** is a different worker/claim with a different shape of data
  — notably, on the Medical & Travel form, several tables have *multiple*
  rows and one table (OTC Drugs) is intentionally empty, to prove the
  layout and the footer hold up at both extremes.

---

## Code modularity & reuse (the mixins)

All shared markup patterns live once in `views/mixins/mixins.pug` and are
called from both `worker-progress.pug` and `medical-travel.pug`:

| Mixin           | What it renders                                   | Used |
|-----------------|----------------------------------------------------|------|
| `docHeader`     | Letterhead + claim number + title                  | 5×   |
| `docFooter`     | Worker App ID / Submitted / Page X of Y             | 5×   |
| `labeledBox`    | Generic bordered box with a label                   | base for `fieldBox` + pain scale |
| `fieldBox`      | Bordered "choose one" radio group wrapper           | 7×   |
| `radioOption`   | One radio button, with an optional revealed field   | 15×  |
| `textBox`       | Free-text comment box with a label                  | 6×   |
| `dateField` / `textField` | One underlined field with a caption       | 8×   |
| `painScale`     | The 1–10 pain scale, generated from a loop           | 1× (10 options generated, not hand-written) |
| `expenseTable`  | **One** mixin renders **all 6** expense tables       | 6×   |
| `privacyRow`    | Privacy-notice acknowledgement line                  | 2×   |

The biggest win is `expenseTable`: the Medical & Travel form has six
visually-identical tables (Prescription Drugs, OTC Drugs, Supplies,
Parking, Mileage, Fare) that only differ in their **columns** and their
**row data**. `config/expense-tables.js` is a plain array describing each
table's columns once; `expenseTable(tableConfig, rows)` renders the
heading, optional note, `<thead>`, and every `<tr>`/`<td>` generically.
Adding a 7th expense category to the real form would mean adding one
object to `expense-tables.js` — no new HTML, no new mixin.

---

## Printing to a standard A4 PDF

`public/css/style.css` sets:

```css
@page { size: A4; margin: 12mm 10mm; }
```

and, in the print media query, each logical `.sheet` forces a page break
after it (`break-after: page`) so the printed output lines up with the
source PDF's own page breaks.

**Footer placement vs. variable table sizes:** this was the trickiest
part of the assignment. In Assignment 1, each `.sheet` had a *fixed*
pixel height with the footer pinned to `position: absolute; bottom: 24px`
inside it — that only looks right if the content happens to fit that
exact height. Sample B intentionally has more table rows than Sample A,
so a fixed-height sheet with an absolutely-positioned footer would have
the footer overlap the last rows of a long table.

The fix: the footer (`.doc-footer`) is now a **normal flow element** that
simply comes *after* all of a sheet's content, with `break-inside: avoid`
so it never gets visually split across a page. Whatever the size of the
loaded record's tables, the footer always lands right after the last row
— and if a sheet's content is taller than one A4 page for a given
record, the browser's print engine simply continues it onto an extra
physical page instead of clipping or overlapping anything. `break-inside:
avoid` is also applied to `.field-box`, `.textbox` and every table `<tr>`
so individual rows/boxes never get sliced in half across a page boundary.

---

## Assumptions made

- Carried over from Assignment 1: the exact WCB letterhead graphic wasn't
  available, so a placeholder logo (`public/img/logo.svg`) sits in the
  same layout position.
- Since the brief calls for a **read-only, backend-driven** display (no
  data entry), every field is rendered `disabled` and the "add row" /
  "remove row" controls from Assignment 1 were removed — the number of
  rows per table is now entirely a property of the backend record.
- "Switching data sets" is implemented as picking a different backend
  record via navigation (`?sample=A` / `?sample=B`), not as typing or
  selecting values in a form control, to keep faith with "no data entry
  on screen."
- The Worker Progress Report's page count is fixed at 3 (its content
  doesn't vary in shape between claims), while the Medical & Travel
  form's *row counts* vary — that's the form used to demonstrate the
  footer/pagination handling described above.
- "Page X of Y" reflects the form's fixed logical page structure (3 pages
  / 2 pages), matching the source PDFs. If a record's tables are so long
  that a logical page spills onto a second physical sheet of paper, that
  physical continuation isn't separately numbered — the same simplification
  Assignment 1 made, now documented explicitly as a known limitation.

---

## Challenges & how they were solved

1. **Footer overlapping table data on the heavier sample** — solved by
   moving the footer into normal document flow instead of absolute
   positioning (see previous section).
2. **Six near-identical tables** — solved with one `expenseTable` mixin
   driven by a shared column config (`config/expense-tables.js`) instead
   of six near-duplicate blocks of markup.
3. **Keeping "no data entry" honest while still looking like the source
   PDF's fillable-looking fields** — solved by rendering every input
   `disabled` (so it's genuinely non-editable) but keeping the same
   styling, so the page still visually matches the PDF's field boxes.
4. **Two genuinely different data shapes** — Sample B was deliberately
   built with an empty table (OTC Drugs) and several multi-row tables,
   so the demo can show the "No entries added" placeholder state and the
   overflow/pagination behavior in the same run.

---

