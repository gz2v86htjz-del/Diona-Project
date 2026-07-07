/* ============================================================
   medical-travel.js — page-specific logic for
   medical-travel-expense.html
   ============================================================ */

// Table registry: maps a short key to its <table id>, <template id>.
// Adding a brand-new expense table to this form later only means
// adding one more line here plus the markup block in the HTML —
// the add/remove/fill logic below is fully generic.
const TABLES = {
  rx:       { tableId: 'tbl-rx',       templateId: 'tpl-rx' },
  otc:      { tableId: 'tbl-otc',      templateId: 'tpl-otc' },
  supplies: { tableId: 'tbl-supplies', templateId: 'tpl-supplies' },
  parking:  { tableId: 'tbl-parking',  templateId: 'tpl-parking' },
  mileage:  { tableId: 'tbl-mileage',  templateId: 'tpl-mileage' },
  fare:     { tableId: 'tbl-fare',     templateId: 'tpl-fare' },
};

function fillRow(row, data) {
  Object.entries(data).forEach(([field, value]) => {
    const input = row.querySelector(`[data-field="${field}"]`);
    if (input) input.value = value;
  });
}

/** Adds one row to a table (via common.js) and optionally pre-fills it with data. */
function addRow(key, data) {
  const cfg = TABLES[key];
  if (!cfg) return;
  const row = addTableRow(cfg.tableId, cfg.templateId);
  if (row && data) fillRow(row, data);
  return row;
}

/** Wipes a table back to zero rows (shows the "No entries added" placeholder). */
function clearTable(key) {
  const cfg = TABLES[key];
  if (!cfg) return;
  clearTableRows(cfg.tableId);
  refreshEmptyState(cfg.tableId);
}

/** Renders a table's full row set from an array of row-data objects — used when swapping sample data sets, so 1 row or 12 rows are handled identically. */
function renderTable(key, rows) {
  clearTable(key);
  rows.forEach(r => addRow(key, r));
}

// ---- Sample data sets ----
const SAMPLE_DATA = {
  A: {
    claimNo: '20042047',
    workerName: 'Madeleine Willson',
    workerAppId: '712041',
    submitted: 'March 28, 2024 20:43',
    rows: {
      rx: [
        { drug: 'Naproxen', prescDate: '2024-02-28', purchDate: '2024-02-29', provider: 'Dr. Best', amount: '20.00' }
      ],
      otc: [
        { drug: 'Advil', purchDate: '2024-03-28', amount: '8.00', seller: 'Shoppers Drug Mart', reason: 'Pain' }
      ],
      supplies: [
        { item: 'Tensor', purchDate: '2024-02-28', prescribed: 'Yes', provider: 'Dr. Best', amount: '10.00', seller: 'Shoppers DrugMart' }
      ],
      parking: [
        { address: '333 St Mary Ave, Winnipeg MB R3C4A5, Canada', date: '2024-03-28', amount: '10.00', meterUsed: 'yes', meterNumber: '12245' }
      ],
      mileage: [
        { apptDate: '2024-03-28', providerAddress: 'HSC, 820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', workAddress: 'WCB, 333 Broadway, Winnipeg MB R3C 4W3, Canada', km: '20' }
      ],
      fare: [
        { apptDate: '2024-03-28', startAddress: '', providerAddress: "HSC Winnipeg Women's Hospital, 665 William Ave, Winnipeg MB R3E 0Z2, Canada", mode: 'Bus', fare: '3.00' },
        { apptDate: '2024-03-27', startAddress: '25 Furby St, Winnipeg MB R3C2A2, Canada', providerAddress: '440 Edmonton St, Winnipeg MB R3B 2M4, Canada', mode: 'Taxi', fare: '15.00' }
      ]
    }
  },
  B: {
    claimNo: '20055391',
    workerName: 'Andre Fontaine',
    workerAppId: '698214',
    submitted: 'July 5, 2026 11:02',
    rows: {
      rx: [
        { drug: 'Naproxen', prescDate: '2026-06-01', purchDate: '2026-06-02', provider: 'Dr. Okafor', amount: '22.50' },
        { drug: 'Cyclobenzaprine', prescDate: '2026-06-10', purchDate: '2026-06-10', provider: 'Dr. Okafor', amount: '31.00' }
      ],
      otc: [], // demonstrates the empty-table state
      supplies: [
        { item: 'Wrist brace', purchDate: '2026-06-05', prescribed: 'Yes', provider: 'Dr. Okafor', amount: '34.99', seller: 'Shoppers Drug Mart' },
        { item: 'Hot/cold gel pack', purchDate: '2026-06-08', prescribed: 'No', provider: '', amount: '14.50', seller: 'London Drugs' },
        { item: 'Compression sleeve', purchDate: '2026-06-15', prescribed: 'Yes', provider: 'Dr. Okafor', amount: '27.00', seller: 'Shoppers Drug Mart' }
      ],
      parking: [
        { address: '820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', date: '2026-06-05', amount: '9.00', meterUsed: 'yes', meterNumber: '30187' },
        { address: '820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', date: '2026-06-12', amount: '9.00', meterUsed: 'yes', meterNumber: '30187' },
        { address: '820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', date: '2026-06-19', amount: '11.00', meterUsed: 'no', meterNumber: '' },
        { address: '820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', date: '2026-06-26', amount: '9.00', meterUsed: 'yes', meterNumber: '30187' },
        { address: '440 Edmonton St, Winnipeg MB R3B 2M4, Canada', date: '2026-07-01', amount: '12.00', meterUsed: 'yes', meterNumber: '44210' }
      ],
      mileage: [
        { apptDate: '2026-06-05', providerAddress: '820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', workAddress: '333 Broadway, Winnipeg MB R3C 4W3, Canada', km: '20' }
      ],
      fare: [
        { apptDate: '2026-06-08', startAddress: '25 Furby St, Winnipeg MB R3C2A2, Canada', providerAddress: '440 Edmonton St, Winnipeg MB R3B 2M4, Canada', mode: 'Taxi', fare: '16.50' },
        { apptDate: '2026-06-12', startAddress: '25 Furby St, Winnipeg MB R3C2A2, Canada', providerAddress: '820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', mode: 'Bus', fare: '3.10' },
        { apptDate: '2026-06-19', startAddress: '25 Furby St, Winnipeg MB R3C2A2, Canada', providerAddress: '820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', mode: 'Bus', fare: '3.10' },
        { apptDate: '2026-06-26', startAddress: '25 Furby St, Winnipeg MB R3C2A2, Canada', providerAddress: '820 Sherbrook St, Winnipeg MB R3A 1R9, Canada', mode: 'Bus', fare: '3.10' }
      ]
    }
  }
};

function applyDataSet(dataset) {
  document.getElementById('claimNo').textContent = dataset.claimNo;
  document.getElementById('workerName').textContent = dataset.workerName;
  stampWorkerAppId(dataset.workerAppId);
  stampSubmitted(dataset.submitted);
  Object.entries(dataset.rows).forEach(([key, rows]) => renderTable(key, rows));
}

document.addEventListener('DOMContentLoaded', () => {
  // Wire "+ Add ..." buttons — each adds one blank, editable row.
  document.querySelectorAll('.add-row-btn').forEach(btn => {
    btn.addEventListener('click', () => addRow(btn.dataset.add));
  });

  stampPageNumbers();

  // Start the page with the exact figures from the source PDF.
  applyDataSet(SAMPLE_DATA.A);

  document.getElementById('sampleSelect').addEventListener('change', (e) => {
    const key = e.target.value;
    if (key && SAMPLE_DATA[key]) applyDataSet(SAMPLE_DATA[key]);
  });

  document.getElementById('printBtn').addEventListener('click', () => window.print());
});
