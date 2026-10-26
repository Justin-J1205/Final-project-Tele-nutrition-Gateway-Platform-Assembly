import ncpt from '../data/ncpt-sample.json';

const find = (list, code) => list.find((x) => x.code === code);

// Turns a VALIDATED structured note (see schemas/note.schema.json) into a plain-text ADIME note.
export function formatNote(n) {
  const dx = find(ncpt.diagnoses, n.diagnosis.code);
  const mon = find(ncpt.monitoring, n.monitoring.code);
  const L = [];
  L.push('NUTRITION CARE PROCESS NOTE (ADIME)');
  L.push(`Patient: ${n.patientName}    Date: ${new Date().toISOString().slice(0, 10)}`);
  L.push('');
  L.push('A - ASSESSMENT');
  for (const d of ncpt.assessmentDomains) {
    if (n.assessment[d.code]) L.push(`- [${d.code}] ${d.name}: ${n.assessment[d.code]}`);
  }
  L.push('');
  L.push('D - NUTRITION DIAGNOSIS (PES)');
  L.push(`${dx.name} (${dx.code}) related to ${n.diagnosis.etiology} as evidenced by ${n.diagnosis.signs}.`);
  L.push('');
  L.push('I - INTERVENTION');
  for (const c of n.intervention.codes) {
    const i = find(ncpt.interventions, c);
    L.push(`- ${i.name} (${i.code})`);
  }
  if (n.intervention.details) L.push(n.intervention.details);
  L.push('');
  L.push('ME - MONITORING & EVALUATION');
  L.push(`- ${mon.name} (${mon.code})${n.monitoring.goal ? ': ' + n.monitoring.goal : ''}`);
  return L.join('\n');
}
