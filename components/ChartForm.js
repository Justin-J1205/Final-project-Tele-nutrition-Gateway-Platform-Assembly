'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ncpt from '../data/ncpt-sample.json';

const empty = {
  dx: '', etiology: '', signs: '', interventions: [], interventionDetails: '',
  monitoring: '', goals: '', assessment: { FH: '', AD: '', BD: '', PD: '', CH: '' },
};

// patient: optional {id, name}. after: 'view' (go to note page) or 'refresh' (stay on page)
export default function ChartForm({ endpoint, patient, after = 'view' }) {
  const router = useRouter();
  const [f, setF] = useState({ ...empty, patientName: patient?.name || '' });
  const [msg, setMsg] = useState('');
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const setA = (k, v) => setF((p) => ({ ...p, assessment: { ...p.assessment, [k]: v } }));
  const toggle = (c) =>
    set('interventions', f.interventions.includes(c) ? f.interventions.filter((x) => x !== c) : [...f.interventions, c]);

  async function submit(e) {
    e.preventDefault();
    setMsg('Saving...');
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, patientId: patient?.id }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || 'Something went wrong');
    if (after === 'view') return router.push('/notes/' + data.id);
    setMsg('Saved ✔');
    setF({ ...empty, patientName: patient?.name || '' });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card">
      <h3>Patient</h3>
      <input placeholder="Patient name" value={f.patientName} disabled={!!patient}
        onChange={(e) => set('patientName', e.target.value)} required />

      <h3>A - Assessment</h3>
      {ncpt.assessmentDomains.map((d) => (
        <label key={d.code}>{d.code} - {d.name}
          <textarea rows={2} value={f.assessment[d.code]} onChange={(e) => setA(d.code, e.target.value)} />
        </label>
      ))}

      <h3>D - Nutrition Diagnosis (PES)</h3>
      <select value={f.dx} onChange={(e) => set('dx', e.target.value)} required>
        <option value="">Select problem...</option>
        {ncpt.diagnoses.map((d) => <option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}
      </select>
      <input placeholder="Etiology (related to...)" value={f.etiology} onChange={(e) => set('etiology', e.target.value)} required />
      <input placeholder="Signs/symptoms (as evidenced by...)" value={f.signs} onChange={(e) => set('signs', e.target.value)} required />

      <h3>I - Intervention</h3>
      <div className="checks">
        {ncpt.interventions.map((i) => (
          <label key={i.code} className="inline">
            <input type="checkbox" checked={f.interventions.includes(i.code)} onChange={() => toggle(i.code)} />
            {i.name} ({i.code})
          </label>
        ))}
      </div>
      <textarea rows={3} placeholder="Intervention details / plan" value={f.interventionDetails}
        onChange={(e) => set('interventionDetails', e.target.value)} />

      <h3>ME - Monitoring &amp; Evaluation</h3>
      <select value={f.monitoring} onChange={(e) => set('monitoring', e.target.value)}>
        <option value="">Select indicator...</option>
        {ncpt.monitoring.map((m) => <option key={m.code} value={m.code}>{m.name} ({m.code})</option>)}
      </select>
      <input placeholder="Goal / target" value={f.goals} onChange={(e) => set('goals', e.target.value)} />

      <button type="submit">Generate &amp; save note</button> <span>{msg}</span>
    </form>
  );
}
