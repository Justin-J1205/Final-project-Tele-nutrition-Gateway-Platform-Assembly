import { requireUser } from '../../lib/auth';
import { readDB } from '../../lib/db';
import MealForm from '../../components/MealForm';

export default function Meals() {
  const user = requireUser('consumer');
  const meals = readDB().meals.filter((m) => m.userId === user.id);
  return (
    <>
      <h1>My meal log</h1>
      <MealForm />
      <div className="card">
        <table>
          <thead><tr><th>When</th><th>Meal</th><th>Food</th><th>Kcal</th></tr></thead>
          <tbody>
            {meals.map((m) => (
              <tr key={m.id}><td>{new Date(m.createdAt).toLocaleString()}</td><td>{m.mealType}</td><td>{m.description}</td><td>{m.calories ?? '-'}</td></tr>
            ))}
          </tbody>
        </table>
        {meals.length === 0 && <p>No meals logged yet.</p>}
      </div>
    </>
  );
}
