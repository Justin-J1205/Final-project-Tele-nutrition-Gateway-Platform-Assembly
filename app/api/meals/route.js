import { NextResponse } from 'next/server';
import { getUser } from '../../../lib/auth';
import { readDB, writeDB, newId } from '../../../lib/db';

export async function POST(req) {
  const user = getUser();
  if (!user || user.role !== 'consumer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const b = await req.json();
  if (!b.description?.trim()) return NextResponse.json({ error: 'Describe the meal' }, { status: 400 });
  const db = readDB();
  db.meals.unshift({
    id: newId(), userId: user.id, mealType: b.mealType, description: b.description.trim(),
    calories: b.calories ? Number(b.calories) : null, createdAt: new Date().toISOString(),
  });
  writeDB(db);
  return NextResponse.json({ ok: true }, { status: 201 });
}
