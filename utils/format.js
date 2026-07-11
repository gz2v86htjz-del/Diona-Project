/**
 * format.js - tiny presentation helpers shared by every Pug view.
 * Kept separate from the data layer so the same raw backend value
 * (e.g. "2024-03-28") can be redisplayed differently in different
 * places without duplicating formatting logic inline in templates.
 */

/** "2024-03-28" -> "March 28, 2024". Empty/missing values pass through as "". */
function formatDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T00:00:00');
  if (isNaN(d.getTime())) return isoDate; // not a date string, show as-is
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** 20 or "20.00" -> "$20.00". Empty/missing values pass through as "". */
function formatCurrency(value) {
  if (value === '' || value === null || value === undefined) return '';
  const n = Number(value);
  if (isNaN(n)) return value;
  return `$${n.toFixed(2)}`;
}

/** Formats a single expense-table cell value according to its declared column type. */
function formatCell(value, type) {
  if (type === 'date') return formatDate(value);
  if (type === 'currency') return formatCurrency(value);
  return value || '';
}

module.exports = { formatDate, formatCurrency, formatCell };
