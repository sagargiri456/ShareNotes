import { prisma } from '@/lib/prisma';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import { redirect } from 'next/navigation';

interface Props {
    searchParams: {
      subject?: string;
      semester?: string;
      branch?: string;
      year?: string;
      title?: string;
    };
  }

export default async function ExploreNotesPage({ searchParams }: Props) {
  const { subject, semester, branch, year, title } = searchParams;

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
      <h1 className="text-2xl font-bold mb-4">🌍 Explore Notes</h1>

      {/* Filter Form */}
      <form className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" method="get">
        <input type="text" name="title" placeholder="Title" defaultValue={title} className="border p-2 rounded" />
        <input type="text" name="subject" placeholder="Subject" defaultValue={subject} className="border p-2 rounded" />
        <input type="text" name="semester" placeholder="Semester" defaultValue={semester} className="border p-2 rounded" />
        <input type="text" name="branch" placeholder="Branch" defaultValue={branch} className="border p-2 rounded" />
        <input type="text" name="year" placeholder="Year" defaultValue={year} className="border p-2 rounded" />
        <button type="submit" className="bg-black text-white rounded px-4 py-2 col-span-2 md:col-span-1">Filter</button>
      </form>

      {/* Results */}
      {notes.length === 0 ? (
        <p className="text-gray-500">No notes found for the selected filters.</p>
      ) : (
        notes.map((note: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; subject: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; semester: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; branch: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; year: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; author: { name: any; }; fileUrl: string | undefined; }) => (
          <div key={note.id} className="border p-4 rounded shadow mb-4">
            <h2 className="font-bold text-lg">{note.title}</h2>
            <p className="text-sm text-gray-600">
              {note.subject} | Sem: {note.semester} | Branch: {note.branch} | Year: {note.year}
            </p>
            <p className="text-xs text-gray-500">By: {note.author?.name || 'Anonymous'}</p>
            <a href={note.fileUrl} target="_blank" className="inline-block mt-2 text-blue-600 underline">
              View / Download
            </a>
          </div>
        ))
      )}
    </div>
  );
}
