/**
 * server.js
 * ------------------------------------------------------------------
 * Assignment 2 entry point.
 *
 * - Renders pages server-side with Pug (no client-side templating).
 * - All claim data is "fetched" from the simulated backend layer in
 *   data/repository.js - nothing is typed into the page.
 * - Switching between the two sample claims happens by choosing a
 *   different backend record (?sample=A / ?sample=B), simulating how
 *   an app would switch between claim records, not by editing fields.
 * ------------------------------------------------------------------
 */

const path = require('path');
const express = require('express');

const repository = require('./data/repository');
const { EXPENSE_TABLES } = require('./config/expense-tables');
const { formatDate, formatCell } = require('./utils/format');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- View engine ----
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Express only caches compiled Pug templates when NODE_ENV=production,
// so template edits show up on refresh automatically during development.

// ---- Static assets (css, images, the tiny print helper script) ----
app.use(express.static(path.join(__dirname, 'public')));

// Make formatting helpers available inside every Pug template.
app.locals.formatDate = formatDate;
app.locals.formatCell = formatCell;

// ---------------------------------------------------------------
// Landing page - links to both forms
// ---------------------------------------------------------------
app.get('/', (req, res) => {
  res.render('index');
});

// ---------------------------------------------------------------
// Worker Progress Report
// GET /worker-progress?sample=A|B
// ---------------------------------------------------------------
app.get('/worker-progress', (req, res) => {
  const { key, data } = repository.getWorkerProgressRecord(req.query.sample);

  // Fixed 3-page layout - the source PDF always has these 3 pages
  // regardless of the claim's content, so page numbering is static.
  res.render('worker-progress', {
    pageTitle: 'Worker Progress Report — WCB',
    toolbarTitle: 'Worker Progress Report — demo controls',
    samplePath: '/worker-progress',
    activeSample: key,
    claim: data,
    totalPages: 3,
  });
});

// ---------------------------------------------------------------
// Medical & Travel Expense Request
// GET /medical-travel?sample=A|B
// ---------------------------------------------------------------
app.get('/medical-travel', (req, res) => {
  const { key, data } = repository.getMedicalTravelRecord(req.query.sample);

  // The source PDF's page break falls right before the bus/taxi fare
  // table, so split the shared table config here (in the route, not
  // the view) into "page 1" and "page 2" groups.
  const page1Tables = EXPENSE_TABLES.slice(0, EXPENSE_TABLES.length - 1);
  const page2Tables = EXPENSE_TABLES.slice(EXPENSE_TABLES.length - 1);

  res.render('medical-travel', {
    pageTitle: 'Medical & Travel Expense Request — WCB',
    toolbarTitle: 'Medical & Travel Expense Request — demo controls',
    samplePath: '/medical-travel',
    activeSample: key,
    claim: data,
    page1Tables,
    page2Tables,
    totalPages: 2,
  });
});

app.listen(PORT, () => {
  console.log(`WCB forms demo running at http://localhost:${PORT}`);
});
