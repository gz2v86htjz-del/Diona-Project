# WCB Form Replication Exercise

Plain **HTML / CSS / JavaScript** (no frameworks, no build step) recreation of two
Workers Compensation Board of Manitoba PDF forms:

1. **Worker Progress Report** (`pages/worker-progress-report.html`)
2. **Medical & Travel Expense Request** (`pages/medical-travel-expense.html`)

Open `index.html` in a browser (or use a live-server extension) — no install required.

---

## How to run
- No build tools, no dependencies. Just open `index.html` in any modern browser.
- Optional: `npx serve .` or VS Code's "Live Server" extension if you prefer a local server.

## Project structure
```
index.html                              landing page linking to both forms
pages/
  worker-progress-report.html
  medical-travel-expense.html
assets/
  css/style.css                         shared styling (header, footer, tables, print layout)
  js/common.js                          shared helpers (row add/remove engine, page-numbering, radio reveal groups)
  js/worker-progress.js                 page-specific logic + sample data for form 1
  js/medical-travel.js                  page-specific logic + sample data for form 2
  img/logo.svg                          letterhead logo placeholder
```

## What's dynamic, and why
Going through both PDFs, the elements that are clearly **per-submission data** (not
part of the fixed form template) are:

- Claim number, worker name, Worker App ID, "Submitted" timestamp, page count
- Every checkbox / radio selection (return-to-work status, recovery status, pain
  level, medication, exercises, etc.)
- Every free-text and date field
- **Repeating table rows** in the expense form — a worker could submit 0, 1, or 12
  prescriptions/parking receipts/taxi fares, so these are the parts that most need
  a proper "dynamic" treatment rather than static markup.

### Worker Progress Report
- All "select one" groups use native `<input type="radio">` sharing a `name`, so
  the browser itself guarantees only one option per group is ever checked —
  selecting a different option automatically un-checks the previous one (visually
  styled as squares to match the source PDF's checkbox look).
- Fields like "I returned to work on: ___" or "Other: ___" are disabled until
  their parent radio is selected (`data-reveals` attribute + a small handler in
  `common.js`), so you can't type a date into a field that contradicts your
  selection.
- The 1–10 pain scale is generated in JS (`buildPainScale()`) rather than
  hand-written 10 times in HTML.
- A toolbar dropdown swaps between two full sample data profiles (including one
  that exercises almost every optional field) to demonstrate the form re-painting
  itself from a plain JS object.

### Medical & Travel Expense Request
- Each of the 6 expense tables (Prescription Drugs, OTC Drugs, Supplies, Parking,
  Mileage, Bus/Taxi Fare) is built from a `<table>` + a matching `<template>` for
  one blank row.
- `common.js` exposes a **generic** `addTableRow()` / `clearTableRows()` /
  `refreshEmptyState()` engine, so every table (whether it ends up with 0, 1, or
  10 rows) is handled by the same code path — nothing is hard-coded per row.
- Each table has its own **"+ Add ..."** button (adds one blank, editable row)
  and each row has a **✕** remove button — so a user can freely resize any
  section instead of being locked to however many rows shipped in the original
  PDF.
- The toolbar's sample-data dropdown demonstrates this range directly: **Sample
  A** mirrors the exact rows from the source PDF (1 row in most tables), and
  **Sample B** loads a heavier claim with multiple rows in several tables *and*
  one table rendered completely empty (shows the "No entries added" placeholder)
  — proving the layout holds up at both extremes.

## Header / footer / pagination
Both forms are split into `.sheet` blocks that mimic individual printed pages —
each carries the full letterhead (logo + address) at the top and a footer with
Worker App ID / Submitted timestamp / **Page X of Y** at the bottom.
`stampPageNumbers()` counts however many `.sheet` blocks exist at render time and
writes the correct "Page X of Y" into every footer, so if a page were added or
removed the numbering would still be correct automatically.

Use the **Print / Save as PDF** button (or Ctrl/Cmd+P) to see the print
stylesheet: it hides the toolbar and add/remove controls and forces one sheet
per printed page (`page-break-after: always`), so the output matches a real
paginated PDF.

## Assumptions made
- The exact WCB letterhead graphic wasn't available to embed pixel-for-pixel, so
  a simple placeholder logo (`assets/img/logo.svg`) was built in the same layout
  position/style — swap the `<img>` `src` for the real asset if available.
- "Meter Used?" and "Was this Prescribed?" were implemented as Yes/No dropdowns
  rather than checkboxes, since the source PDF renders them as plain text
  answers inside a table cell rather than boxed checkbox controls.
- Field-level validation (e.g. required fields, numeric ranges) was intentionally
  left permissive, since the brief asked for a *display/structure* replica with
  dynamic data binding, not a submission workflow with backend validation.
- "Bus or Taxi" and mileage sections don't recalculate totals automatically,
  since no running-total field appears anywhere on the source PDF.
