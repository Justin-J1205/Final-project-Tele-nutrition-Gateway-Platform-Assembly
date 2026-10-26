import { NextResponse } from 'next/server';
import { getUser } from '../../../lib/auth';
import { readDB, writeDB, newId } from '../../../lib/db';
import { formatNote } from '../../../lib/ncpt';
import { buildNote, validateNote } from '../../../lib/validate';

export async function POST(req) {
  const user = getUser();
  if (!user || user.role !== 'dietitian') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const b = await req.json();
  const db = readDB();
  const patient = db.users.find((u) => u.id === b.patientId && u.role === 'consumer');
  if (!patient) return NextResponse.json({ error: 'Unknown patient' }, { status: 400 });
  const structured = buildNote(b, patient.name);
  const errors = validateNote(structured);
  if (errors.length)
    return NextResponse.json({ error: 'Validation failed: ' + errors.join('; '), errors }, { status: 400 });
  const note = {
    id: newId(), patientId: patient.id, providerId: user.id, createdAt: new Date().toISOString(),
    ...structured, text: formatNote(structured),
  };
  db.notes.unshift(note);
  writeDB(db);
  return NextResponse.json(note, { status: 201 });
}
