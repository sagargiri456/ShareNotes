import { prisma } from '@/lib/prisma';
import { getUserIdFromToken } from '@/lib/auth';
import { headers } from 'next/headers';

interface Note {
  id: string;
  title: string;
  subject: string;
  semester: string;
  branch: string;
  year: string;
  fileUrl?: string;
}

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
      {notes.map((note: Note) => (
        <div key={note.id} className="border p-4 rounded shadow">
          <h2 className="font-bold text-lg">{note.title}</h2>
          <p className="text-sm text-gray-600">
            {note.subject} | Sem: {note.semester} | Branch: {note.branch} | Year: {note.year}
          </p>
          <a
            href={note.fileUrl}
            target="_blank"
            className="inline-block mt-2 text-blue-600 underline"
          >
            View / Download
          </a>
        </div>
      ))}
    </div>
  );
}
