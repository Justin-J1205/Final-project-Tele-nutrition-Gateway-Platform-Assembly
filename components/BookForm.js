'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookForm() {
  const router = useRouter();
  const [msg, setMsg] = useState('');
  async function submit(e) {
    e.preventDefault();
    const form = e.target;
    const body = JSON.stringify(Object.fromEntries(new FormData(form)));
    const res = await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    if (!res.ok) return setMsg((await res.json()).error);
    form.reset(); setMsg('Booked ✔'); router.refresh();
  }
  return (
    <form onSubmit={submit} className="card">
      <h3>Book a consultation</h3>
      <input name="startsAt" type="datetime-local" required />
      <input name="reason" placeholder="Reason for visit" />
      <button type="submit">Book</button> <span>{msg}</span>
    </form>
  );
}
