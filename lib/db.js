import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// JSON-file "database" for the MVP. On Vercel the disk is read-only except /tmp (resets on cold start).
const FILE = process.env.VERCEL ? '/tmp/db.json' : path.join(process.cwd(), 'data', 'db.json');

export function hashPassword(pw) {
  const salt = crypto.randomBytes(8).toString('hex');
  return `${salt}:${crypto.scryptSync(pw, salt, 32).toString('hex')}`;
}
export function checkPassword(pw, stored) {
  const [salt, hash] = stored.split(':');
  const a = Buffer.from(hash, 'hex');
  const b = crypto.scryptSync(pw, salt, 32);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function seed() {
  return {
    users: [
      { id: 'u-consumer', role: 'consumer', name: 'Alex Consumer', email: 'consumer@demo.com', password: hashPassword('demo123') },
      { id: 'u-dietitian', role: 'dietitian', name: 'Dana Dietitian, RD', email: 'dietitian@demo.com', password: hashPassword('demo123') },
    ],
    meals: [], notes: [], appointments: [],
  };
}

export function readDB() {
  if (!fs.existsSync(FILE)) writeDB(seed());
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}
export function writeDB(db) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}
export const newId = () => crypto.randomUUID();
