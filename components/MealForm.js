'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MealForm() {
  const router = useRouter();
  const [msg, setMsg] = useState('');
  async function submit(e) {
    e.preventDefault();
    const form = e.target;
    const body = JSON.stringify(Object.fromEntries(new FormData(form)));
    const res = await fetch('/api/meals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    if (!res.ok) return setMsg((await res.json()).error);
    form.reset(); setMsg('Logged ✔'); router.refresh();
  }
  return (
    <form onSubmit={submit} className="card">
      <select name="mealType" required>
        {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((m) => <option key={m}>{m}</option>)}
      </select>
      <input name="description" placeholder="What did you eat?" required />
      <input name="calories" type="number" min="0" placeholder="Calories (optional)" />
      <button type="submit">Log meal</button> <span>{msg}</span>
    </form>
  );
}
