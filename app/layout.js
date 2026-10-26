import Link from 'next/link';
import './globals.css';
import { getUser } from '../lib/auth';
export const metadata = { title: 'Tele-nutrition Platform' };
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }) {
  const user = getUser();
  return (
    <html lang="en"><body>
      <nav>
        <strong>Tele-nutrition</strong>
        {user?.role === 'consumer' && <Link href="/meals">Meal log</Link>}
        {user?.role === 'dietitian' && <Link href="/provider">Patients</Link>}
        {user && <Link href="/appointments">Appointments</Link>}
        <span style={{ marginLeft: 'auto' }} />
        {user ? (
          <form action="/api/logout" method="post"><span>{user.name} ({user.role}) </span><button>Log out</button></form>
        ) : <Link href="/login">Log in</Link>}
      </nav>
      <main>{children}</main>
    </body></html>
  );
}
