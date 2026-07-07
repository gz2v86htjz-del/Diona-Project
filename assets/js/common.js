/* ============================================================
   common.js — shared helpers for both WCB form pages
   ============================================================ */

/**
 * Adds a new row to a <table class="data-table"> by cloning a
 * <template> that lives right after the table. Each new row gets a
 * "remove" button wired up. Works no matter how many rows already
 * exist (0, 1, or 20) — this is what lets the same table represent
 * a single line item or a long list from real claim data.
 */
function addTableRow(tableId, templateId) {
  const table = document.getElementById(tableId);
  const template = document.getElementById(templateId);
  if (!table || !template) return;
  const tbody = table.tBodies[0];
  const clone = template.content.cloneNode(true);
  const row = clone.querySelector('tr');
  wireRemoveButton(row, tableId);
  tbody.appendChild(clone);
  refreshEmptyState(tableId);
  return row;
}

function wireRemoveButton(row, tableId) {
  const btn = row.querySelector('.remove-row-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    row.remove();
    refreshEmptyState(tableId);
  });
}

/** Wire up remove buttons already present in the initial HTML (sample data rows). */
function wireExistingRows(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  table.tBodies[0].querySelectorAll('tr').forEach(row => wireRemoveButton(row, tableId));
}

/** Shows/hides a "no entries yet" row if a table body is empty. */
function refreshEmptyState(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.tBodies[0];
  const emptyRow = tbody.querySelector('.empty-row');
  const realRows = [...tbody.querySelectorAll('tr')].filter(r => !r.classList.contains('empty-row'));
  if (realRows.length === 0) {
    if (!emptyRow) {
      const cols = table.querySelectorAll('thead th').length;
      const tr = document.createElement('tr');
      tr.className = 'empty-row';
      tr.innerHTML = `<td colspan="${cols}" style="text-align:center;color:#888;font-style:italic;">No entries added</td>`;
      tbody.appendChild(tr);
    }
  } else if (emptyRow) {
    emptyRow.remove();
  }
}

/** Clears a table body completely (used before loading a new sample data set). */
function clearTableRows(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  table.tBodies[0].innerHTML = '';
}

/**
 * Replaces the currently checked mutual-exclusion pairing when a
 * "reveal on select" radio is chosen — e.g. selecting "I returned to
 * work on:" enables its date input, while choosing a sibling radio
 * disables/clears it. Native <input type="radio"> already gives us
 * one-only-selected-per-group for free; this just layers on the
 * enable/disable of the companion free-text/date fields.
 */
function initRevealGroups(root = document) {
  // Find every radio-group name that contains at least one "reveals" member,
  // then listen on *every* radio in that group — not just the one with
  // data-reveals — so switching to a sibling option correctly disables and
  // clears the previously-revealed field.
  const groupNames = new Set();
  root.querySelectorAll('[data-reveals]').forEach(input => groupNames.add(input.name));

  groupNames.forEach(groupName => {
    document.querySelectorAll(`input[name="${groupName}"]`).forEach(member => {
      member.addEventListener('change', () => {
        document.querySelectorAll(`input[name="${groupName}"]`).forEach(sibling => {
          const revealId = sibling.getAttribute('data-reveals');
          if (!revealId) return;
          const target = document.getElementById(revealId);
          if (!target) return;
          target.disabled = !sibling.checked;
          if (!sibling.checked) target.value = '';
        });
      });
    });
  });
}

/** Stamps every .sheet footer with "Page X of N" based on how many .sheet blocks exist right now. */
function stampPageNumbers() {
  const sheets = document.querySelectorAll('.sheet');
  sheets.forEach((sheet, i) => {
    const el = sheet.querySelector('.page-num');
    if (el) el.textContent = `Page ${i + 1} of ${sheets.length}`;
  });
}

/** Writes the same "submitted" timestamp into every footer on the page. */
function stampSubmitted(dateString) {
  document.querySelectorAll('.submitted-value').forEach(el => el.textContent = dateString);
}

function stampWorkerAppId(id) {
  document.querySelectorAll('.worker-app-id-value').forEach(el => el.textContent = id);
}

function nowFormatted() {
  const d = new Date();
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  const datePart = d.toLocaleDateString('en-US', opts);
  const timePart = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${datePart} ${timePart}`;
}
