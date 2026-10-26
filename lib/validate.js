import Ajv from 'ajv';
import note from '../schemas/note.schema.json';
import assessment from '../schemas/assessment.schema.json';
import diagnosis from '../schemas/diagnosis.schema.json';
import intervention from '../schemas/intervention.schema.json';
import monitoring from '../schemas/monitoring.schema.json';

const ajv = new Ajv({ allErrors: true });
[assessment, diagnosis, intervention, monitoring].forEach((s) => ajv.addSchema(s));
const validate = ajv.compile(note);

// Returns [] when valid, otherwise a list of readable error strings.
export function validateNote(n) {
  if (validate(n)) return [];
  return validate.errors.map((e) => `${e.instancePath || 'note'} ${e.message}`);
}

// Builds the structured note from the flat form payload (empty assessment fields dropped).
export function buildNote(b, patientName) {
  const assessment = {};
  for (const [k, v] of Object.entries(b.assessment || {})) if (String(v).trim()) assessment[k] = String(v).trim();
  return {
    patientName,
    assessment,
    diagnosis: { code: b.dx, etiology: (b.etiology || '').trim(), signs: (b.signs || '').trim() },
    intervention: { codes: b.interventions || [], details: (b.interventionDetails || '').trim() },
    monitoring: { code: b.monitoring, goal: (b.goals || '').trim() },
  };
}
