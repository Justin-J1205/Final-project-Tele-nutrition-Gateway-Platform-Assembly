import { redirect } from 'next/navigation';
import { getUser } from '../lib/auth';
export default function Home() {
  const u = getUser();
  if (!u) redirect('/login');
  redirect(u.role === 'dietitian' ? '/provider' : '/meals');
}
