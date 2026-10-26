import { NextResponse } from 'next/server';
import { readDB, checkPassword } from '../../../lib/db';
import { makeToken } from '../../../lib/auth';

export async function POST(req) {
  const { email, password } = await req.json();
  const u = readDB().users.find((x) => x.email === String(email).toLowerCase());
  if (!u || !checkPassword(String(password), u.password))
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const res = NextResponse.json({ role: u.role });
  res.cookies.set('session', makeToken(u.id), {
    httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 8,
  });
  return res;
}
