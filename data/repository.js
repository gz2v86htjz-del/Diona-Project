/**
 * repository.js
 * ------------------------------------------------------------------
 * Stand-in "backend". Assignment 2 explicitly asks for data to be
 * simulated as if it came from a backend, with NO data entry on the
 * screen. In a production system these two functions would issue an
 * HTTP call to a claims API / run a DB query; here they read from a
 * local JSON file instead, but every consumer (the routes) only ever
 * talks to this module, never to the JSON files directly.
 *
 * That indirection is the whole point: swapping this module out for
 * a real HTTP client or ORM later would not require touching any
 * route or view code.
 * ------------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const workerProgressRecords = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'worker-progress.json'), 'utf-8')
);

const medicalTravelRecords = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'medical-travel.json'), 'utf-8')
);

/** Valid sample keys we simulate as "claim records" coming from the backend. */
const SAMPLE_KEYS = ['A', 'B'];

/**
 * "Fetches" a Worker Progress Report claim record by sample key.
 * Falls back to sample A if an unknown/missing key is requested,
 * the way a real API might default to the most recent claim.
 */
function getWorkerProgressRecord(sampleKey) {
  const key = SAMPLE_KEYS.includes(sampleKey) ? sampleKey : 'A';
  return { key, data: workerProgressRecords[key] };
}

/** "Fetches" a Medical & Travel Expense Request claim record by sample key. */
function getMedicalTravelRecord(sampleKey) {
  const key = SAMPLE_KEYS.includes(sampleKey) ? sampleKey : 'A';
  return { key, data: medicalTravelRecords[key] };
}

module.exports = {
  SAMPLE_KEYS,
  getWorkerProgressRecord,
  getMedicalTravelRecord,
};
