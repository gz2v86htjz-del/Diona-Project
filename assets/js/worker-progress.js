/* ============================================================
   worker-progress.js — page-specific logic for
   worker-progress-report.html
   ============================================================ */

// ---- 1. Build the 1-10 pain scale (kept out of the HTML so the
//         number of points is driven by data, not hand-typed markup) ----
function buildPainScale() {
  const wrap = document.getElementById('painScale');
  wrap.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    const span = document.createElement('span');
    span.className = 'option';
    span.innerHTML = `
      <input type="radio" id="pain_${i}" name="pain" value="${i}">
      <label for="pain_${i}"><span class="n">${i}</span></label>
    `;
    wrap.appendChild(span);
  }
}

// ---- 2. Sample data sets: swapping this object is all that's needed
//         to re-paint the whole form with different claim data ----
const SAMPLE_PROFILES = {
  A: {
    claimNo: '20042047',
    workerName: 'Madeleine Willson',
    workerAppId: '712041',
    submitted: 'March 19, 2024 19:21',
    rtw: 'returned',
    rtwDate: '2024-03-15',
    working: 'wk_mod_red',
    rtwGoing: 'Terrible. Testing Testing',
    recovery: 'rec_full',
    recoveryComments: '',
    pain: 1,
    medtreat: 'med_no',
    exercise: 'ex_no',
    medication: 'rx_no',
    otherInfo: 'No info Testing Testing'
  },
  B: {
    claimNo: '20055391',
    workerName: 'Andre Fontaine',
    workerAppId: '698214',
    submitted: 'July 2, 2026 09:14',
    rtw: 'not_returned',
    working: null,
    rtwGoing: '',
    expectReturnDate: '2026-07-21',
    rtwConcerns: 'My shoulder still locks up when I lift anything over 5 lbs. Not confident about lifting duties yet.',
    contactName: 'Priya Nadarajah',
    contactDate: '2026-06-30',
    recovery: 'rec_notfull',
    recoveryComments: 'Range of motion improving slowly with physiotherapy.',
    pain: 6,
    medtreat: 'med_yes',
    medProviderType: 'Physiotherapist',
    lastTreatDate: '2026-06-28',
    lastTreatName: 'Dr. Okafor',
    nextTreatDate: '2026-07-12',
    nextTreatName: 'Dr. Okafor',
    chiroFrequency: '2x per week',
    exercise: 'ex_yes',
    exerciseList: 'Pendulum swings, resistance band external rotation, wall slides — 3 sets daily.',
    medication: 'rx_yes',
    medicationName: 'Naproxen 250mg',
    otherInfo: 'Requesting an ergonomic assessment of my workstation before full return.'
  }
};

function clearForm() {
  document.querySelectorAll('input[type="text"], input[type="date"], textarea').forEach(el => {
    if (el.disabled) return;
    el.value = '';
  });
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(el => el.checked = false);
  document.querySelectorAll('[data-reveals]').forEach(input => {
    const target = document.getElementById(input.getAttribute('data-reveals'));
    if (target) target.disabled = true;
  });
}

function applyProfile(profile) {
  clearForm();

  document.getElementById('claimNo').textContent = profile.claimNo;
  document.querySelectorAll('.claimNoEcho').forEach(el => el.textContent = profile.claimNo);
  document.getElementById('workerName').textContent = profile.workerName;
  stampWorkerAppId(profile.workerAppId);
  stampSubmitted(profile.submitted);

  const setRadio = (id) => { if (id) { const el = document.getElementById(id); if (el) { el.checked = true; el.dispatchEvent(new Event('change')); } } };
  const setVal = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };

  if (profile.rtw) setRadio('rtw_' + (profile.rtw === 'not_missed' ? 'notmissed' : profile.rtw === 'not_returned' ? 'notreturned' : 'returned'));
  setVal('rtwDate', profile.rtwDate);
  if (profile.working) setRadio(profile.working);
  setVal('rtwGoing', profile.rtwGoing);
  setVal('expectReturnDate', profile.expectReturnDate);
  setVal('rtwConcerns', profile.rtwConcerns);
  setVal('contactName', profile.contactName);
  setVal('contactDate', profile.contactDate);
  if (profile.recovery) setRadio(profile.recovery);
  setVal('recoveryComments', profile.recoveryComments);

  if (profile.pain) setRadio('pain_' + profile.pain);

  if (profile.medtreat) setRadio(profile.medtreat);
  setVal('medProviderType', profile.medProviderType);
  setVal('lastTreatDate', profile.lastTreatDate);
  setVal('lastTreatName', profile.lastTreatName);
  setVal('nextTreatDate', profile.nextTreatDate);
  setVal('nextTreatName', profile.nextTreatName);
  setVal('chiroFrequency', profile.chiroFrequency);

  if (profile.exercise) setRadio(profile.exercise);
  setVal('exerciseList', profile.exerciseList);

  if (profile.medication) setRadio(profile.medication);
  setVal('medicationName', profile.medicationName);

  setVal('otherInfo', profile.otherInfo);
}

document.addEventListener('DOMContentLoaded', () => {
  buildPainScale();
  initRevealGroups();
  stampPageNumbers();

  // Load the exact values from the source PDF by default.
  applyProfile(SAMPLE_PROFILES.A);

  document.getElementById('sampleSelect').addEventListener('change', (e) => {
    const key = e.target.value;
    if (key && SAMPLE_PROFILES[key]) applyProfile(SAMPLE_PROFILES[key]);
  });

  document.getElementById('printBtn').addEventListener('click', () => window.print());
});
