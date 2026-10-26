import Link from 'next/link';
import { requireUser } from '../../lib/auth';
import { readDB } from '../../lib/db';

export default function Provider() {
  requireUser('dietitian');
  const db = readDB();
  const patients = db.users.filter((u) => u.role === 'consumer');
  return (
    <>
      <h1>Patients</h1>
      {patients.map((p) => (
        <div className="card" key={p.id}>
          <Link href={`/provider/patients/${p.id}`}><strong>{p.name}</strong></Link>
          <div>{db.meals.filter((m) => m.userId === p.id).length} meals logged &middot; {db.notes.filter((n) => n.patientId === p.id).length} notes</div>
        </div>
      ))}
    </>
  );
}
