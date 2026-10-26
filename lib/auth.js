import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readDB } from './db';

const SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';
const sign = (v) => crypto.createHmac('sha256', SECRET).update(v).digest('hex');

export function makeToken(userId) {
  const p = Buffer.from(userId).toString('base64url');
  return `${p}.${sign(p)}`;
}

export function getUser() {
  const t = cookies().get('session')?.value;
  if (!t) return null;
  const [p, s] = t.split('.');
  if (!p || !s) return null;
  const expected = sign(p);
  if (s.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected))) return null;
  const u = readDB().users.find((x) => x.id === Buffer.from(p, 'base64url').toString());
  return u ? { id: u.id, role: u.role, name: u.name, email: u.email } : null;
}

export function requireUser(role) {
  const u = getUser();
  if (!u) redirect('/login');
  if (role && u.role !== role) redirect('/');
  return u;
}
