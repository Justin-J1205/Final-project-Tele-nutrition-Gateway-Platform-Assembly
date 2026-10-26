import { NextResponse } from 'next/server';
import { getUser } from '../../../lib/auth';
import { readDB, writeDB, newId } from '../../../lib/db';

export async function POST(req) {
  const user = getUser();
  if (!user || user.role !== 'consumer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const b = await req.json();
  if (!b.startsAt) return NextResponse.json({ error: 'Pick a date and time' }, { status: 400 });
  const db = readDB();
  const provider = db.users.find((u) => u.role === 'dietitian');
  if (db.appointments.some((a) => a.providerId === provider.id && a.startsAt === b.startsAt))
    return NextResponse.json({ error: 'That slot is taken' }, { status: 409 });
  db.appointments.push({
    id: newId(), consumerId: user.id, providerId: provider.id, startsAt: b.startsAt,
    reason: b.reason || '', roomSecret: newId().replace(/-/g, ''),
  });
  writeDB(db);
  return NextResponse.json({ ok: true }, { status: 201 });
}
