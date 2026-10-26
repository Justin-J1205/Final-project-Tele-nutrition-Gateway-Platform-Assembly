'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [err, setErr] = useState('');
  async function submit(e) {
    e.preventDefault();
    const body = JSON.stringify(Object.fromEntries(new FormData(e.target)));
    const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    if (!res.ok) return setErr('Invalid email or password');
    const { role } = await res.json();
    router.push(role === 'dietitian' ? '/provider' : '/meals');
    router.refresh();
  }
  return (
    <form onSubmit={submit} className="card" style={{ maxWidth: 380, margin: '0 auto' }}>
      <h2>Log in</h2>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Log in</button> <span style={{ color: 'crimson' }}>{err}</span>
      <p style={{ fontSize: '.85rem' }}>Demo: consumer@demo.com or dietitian@demo.com / demo123</p>
    </form>
  );
}
