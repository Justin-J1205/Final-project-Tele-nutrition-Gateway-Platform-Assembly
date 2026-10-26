import Link from 'next/link';
import { requireUser } from '../../lib/auth';
import { readDB } from '../../lib/db';
import BookForm from '../../components/BookForm';

export default function Appointments() {
  const user = requireUser();
  const db = readDB();
  const mine = db.appointments
    .filter((a) => (user.role === 'consumer' ? a.consumerId === user.id : a.providerId === user.id))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const name = (id) => db.users.find((u) => u.id === id)?.name;
  return (
    <>
      <h1>Appointments</h1>
      {user.role === 'consumer' && <BookForm />}
      {mine.map((a) => (
        <div className="card" key={a.id}>
          <strong>{new Date(a.startsAt).toLocaleString()}</strong>
          <div>{user.role === 'consumer' ? `With ${name(a.providerId)}` : `Patient: ${name(a.consumerId)}`}{a.reason ? ` - ${a.reason}` : ''}</div>
          <Link className="btn" href={`/session/${a.id}`}>Join video session</Link>
        </div>
      ))}
      {mine.length === 0 && <p>No appointments yet.</p>}
    </>
  );
}
