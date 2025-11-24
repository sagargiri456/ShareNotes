'use client';

import { useTransition } from 'react';

interface Note {
  id: string;
  title: string;
  subject: string;
  semester: string;
  branch: string;
  year: string;
  fileUrl?: string;
}

export default function NoteCard({ note }: { note: Note }) {
  const [, startTransition] = useTransition();

  const deleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`/api/admin/delete-note/${noteId}`, {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      alert('Note deleted successfully');
      // 🌀 Trigger a refresh (or use router.refresh() if using Next 13 App Router)
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Error deleting note');
    }
  };

  return (
    <div className="border p-4 rounded shadow relative group">
      <button
        onClick={() => startTransition(() => deleteNote(note.id))}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
        title="Delete note"
      >
        🗑️
      </button>

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
  );
} 