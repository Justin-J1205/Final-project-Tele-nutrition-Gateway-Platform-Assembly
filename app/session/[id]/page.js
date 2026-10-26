import { redirect } from 'next/navigation';
import { requireUser } from '../../../lib/auth';
import { readDB } from '../../../lib/db';
import JitsiRoom from '../../../components/JitsiRoom';

export default function Session({ params }) {
  const user = requireUser();
  const appt = readDB().appointments.find((a) => a.id === params.id);
  // Only the booked patient and the provider may enter this room.
  if (!appt || (appt.consumerId !== user.id && appt.providerId !== user.id)) redirect('/appointments');
  return (
    <>
      <h1>Virtual consultation</h1>
      <p>{new Date(appt.startsAt).toLocaleString()} &mdash; allow camera/microphone when prompted.</p>
      <JitsiRoom room={`tng-${appt.roomSecret}`} displayName={user.name} />
    </>
  );
}
