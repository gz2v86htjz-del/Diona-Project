/**
 * print.js
 * ------------------------------------------------------------------
 * The ONLY client-side script in this app. Everything else — form
 * values, table rows, page numbers — is rendered server-side by Pug
 * from the simulated backend data, so there is no client logic left
 * to write beyond "open the browser's print dialog".
 * ------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }
});
