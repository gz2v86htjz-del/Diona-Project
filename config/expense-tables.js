/**
 * expense-tables.js
 * ------------------------------------------------------------------
 * Single source of truth for the 6 repeating tables on the Medical &
 * Travel Expense Request form. Each entry just says "what are my
 * columns and where does each column's value live in a row object".
 *
 * The Pug view then renders every table with ONE generic mixin
 * (see views/mixins/mixins.pug -> expenseTable). Adding a 7th table
 * to the real form later would only mean adding one more object to
 * this array plus a data source - no new markup, no new mixin.
 *
 * type controls formatting only:
 *   'text'     -> printed as-is
 *   'date'     -> formatted as "Mon D, YYYY"
 *   'currency' -> formatted as "$12.34"
 * ------------------------------------------------------------------
 */

const EXPENSE_TABLES = [
  {
    key: 'rx',
    title: 'Prescription Drugs',
    columns: [
      { field: 'drug', label: 'Drug Name', type: 'text' },
      { field: 'prescDate', label: 'Prescription Date', type: 'date' },
      { field: 'purchDate', label: 'Date Purchased', type: 'date' },
      { field: 'provider', label: 'Healthcare Provider Name', type: 'text' },
      { field: 'amount', label: 'Paid Amount', type: 'currency' },
    ],
  },
  {
    key: 'otc',
    title: 'Over-the-Counter Drugs',
    columns: [
      { field: 'drug', label: 'Drug Name', type: 'text' },
      { field: 'purchDate', label: 'Date Purchased', type: 'date' },
      { field: 'amount', label: 'Paid Amount', type: 'currency' },
      { field: 'seller', label: "Seller's Name", type: 'text' },
      { field: 'reason', label: 'Reason for Purchasing', type: 'text' },
    ],
  },
  {
    key: 'supplies',
    title: 'Bandages, Braces or Other Medical Supplies',
    columns: [
      { field: 'item', label: 'Item Purchased', type: 'text' },
      { field: 'purchDate', label: 'Date Purchased', type: 'date' },
      { field: 'prescribed', label: 'Was this Prescribed?', type: 'text' },
      { field: 'provider', label: 'Healthcare Provider Name', type: 'text' },
      { field: 'amount', label: 'Paid Amount', type: 'currency' },
      { field: 'seller', label: "Seller's Name", type: 'text' },
    ],
  },
  {
    key: 'parking',
    title: 'Parking for Medical Appointments',
    columns: [
      { field: 'address', label: 'Address of Healthcare Provider/Medical Facility', type: 'text' },
      { field: 'date', label: 'Date', type: 'date' },
      { field: 'amount', label: 'Paid Amount', type: 'currency' },
      { field: 'meterUsed', label: 'Meter Used?', type: 'text' },
      { field: 'meterNumber', label: 'Meter Number', type: 'text' },
    ],
  },
  {
    key: 'mileage',
    title: 'Mileage to Medical Appointments',
    note: 'The WCB will generally reimburse only those transportation costs which are in excess of costs that would be incurred by the worker while travelling to and from work.',
    columns: [
      { field: 'apptDate', label: 'Appointment Date', type: 'date' },
      { field: 'providerAddress', label: 'Address of Healthcare Provider/Medical Facility', type: 'text' },
      { field: 'workAddress', label: 'Address of Workplace', type: 'text' },
      { field: 'km', label: 'Number of km (Round Trip)', type: 'text' },
    ],
  },
  {
    key: 'fare',
    title: 'Bus or Taxi Fare for Medical Appointments *',
    note: '*Note: Pre-approval is required from your WCB representative to claim taxi fare(s).',
    columns: [
      { field: 'apptDate', label: 'Appointment Date', type: 'date' },
      { field: 'startAddress', label: 'Address of Starting Point', type: 'text' },
      { field: 'providerAddress', label: 'Address of Healthcare Provider/Medical Facility', type: 'text' },
      { field: 'mode', label: 'Bus or Taxi', type: 'text' },
      { field: 'fare', label: 'Total Fare Paid', type: 'currency' },
    ],
  },
];

module.exports = { EXPENSE_TABLES };
