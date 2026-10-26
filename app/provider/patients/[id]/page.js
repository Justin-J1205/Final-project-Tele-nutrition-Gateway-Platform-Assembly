import { notFound } from 'next/navigation';
import { requireUser } from '../../../../lib/auth';
import { readDB } from '../../../../lib/db';
import ChartForm from '../../../../components/ChartForm';

export default function PatientPage({ params }) {
  requireUser('dietitian');
  const db = readDB();
  const patient = db.users.find((u) => u.id === params.id && u.role === 'consumer');
  if (!patient) notFound();
  const meals = db.meals.filter((m) => m.userId === patient.id).slice(0, 10);
  const notes = db.notes.filter((n) => n.patientId === patient.id);
  return (
    <>
      <h1>{patient.name}</h1>
      <div className="card">
        <h3>Recent meal log</h3>
        {meals.length === 0 ? <p>Nothing logged yet.</p> : (
          <table><tbody>{meals.map((m) => (
            <tr key={m.id}><td>{new Date(m.createdAt).toLocaleDateString()}</td><td>{m.mealType}</td><td>{m.description}</td><td>{m.calories ?? '-'}</td></tr>
          ))}</tbody></table>
        )}
      </div>
      <h2>Chart a note</h2>
      <ChartForm endpoint="/api/notes" patient={{ id: patient.id, name: patient.name }} after="refresh" />
      <h2>Previous notes</h2>
      {notes.map((n) => <div className="card" key={n.id}><pre>{n.text}</pre></div>)}
      {notes.length === 0 && <p>No notes yet.</p>}
    </>
  );
}
