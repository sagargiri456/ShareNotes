import CommentButton from '@/components/CommentButton';
import LikeButton from '@/components/LikeButton';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

interface Props {
    searchParams: Promise<{
      subject?: string;
      semester?: string;
      branch?: string;
      year?: string;
      title?: string;
    }>;
  }

export default async function ExploreNotesPage({ searchParams }: Props) {
  const { subject, semester, branch, year, title } = await searchParams;

  const notes = await prisma.note.findMany({
    where: {
      subject: subject || undefined,
      semester: semester || undefined,
      branch: branch || undefined,
      year: year || undefined,
      title: title ? { contains: title, mode: 'insensitive' } : undefined,
    },
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="max-w-4xl mx-auto mt-10">
     <h1 className="text-3xl font-bold font-poppins text-gray-800 mb-4 tracking-tight flex items-center gap-2">
  <span className="text-sm"><Image width={50} height={50} src="/explore_logo.png" alt="explore_logo" /></span>
  Explore Notes
</h1>

      {/* Filter Form */}
      <form className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 bg-white p-4 rounded shadow">
        <input type="text" name="title" placeholder="Title" defaultValue={title} className="border p-2 rounded text-sm" />
        <input type="text" name="subject" placeholder="Subject" defaultValue={subject} className="border p-2 rounded text-sm" />
        <input type="text" name="semester" placeholder="Semester" defaultValue={semester} className="border p-2 rounded text-sm" />
        <input type="text" name="branch" placeholder="Branch" defaultValue={branch} className="border p-2 rounded text-sm" />
        <input type="text" name="year" placeholder="Year" defaultValue={year} className="border p-2 rounded text-sm" />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 col-span-2 md:col-span-1 hover:bg-blue-700 transition">
          🔍 Filter
        </button>
      </form>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {notes.map((note) => (
    <div key={note.id} className="bg-white hover:scale-[1.02] transition-transform shadow-md hover:shadow-lg transition rounded-lg p-4 flex flex-col items-center text-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{note.title}</h2>

      {/* PDF Preview Slider Here */}
      <div className="mb-3">
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(note.fileUrl)}&embedded=true`}
          style={{ width: '100%', height: '400px' }}
          frameBorder="0"
        />
      </div>
      

      <p className="text-sm text-gray-600 mb-1">
        {note.subject} | Sem: {note.semester} | Branch: {note.branch} | Year: {note.year}
      </p>
      <p className="text-xs text-gray-500 mb-2">By: {note.author?.name || "Anonymous"}</p>
      <a href={note.fileUrl} target="_blank" className="text-blue-600 text-sm underline hover:text-blue-800 mb-2">
              View / Download
      </a>
      

      {/* Like & Comment Section */}
      <div className="flex justify-center gap-4 text-gray-500 text-sm">
        <LikeButton noteId={note.id} />
        <CommentButton noteId={note.id} />
      </div>
    </div>
  ))}
</div>
    </div>
  );
}
