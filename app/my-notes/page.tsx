import { prisma } from '@/lib/prisma';
import { getUserIdFromToken } from '@/lib/auth';
import { headers } from 'next/headers';
import { NoteCard } from './NoteCard';

export default async function MyNotesPage() {
  const reqHeaders = await headers();
  const userId = await getUserIdFromToken(reqHeaders);
  if (!userId) return <div className="text-center mt-10">Please login to view your notes.</div>;

  const notes = await prisma.note.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
  });

  if (notes.length === 0) return <div className="text-center mt-10">No notes uploaded yet.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-semibold">📁 My Notes</h1>
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
