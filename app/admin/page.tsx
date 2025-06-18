import { prisma } from '@/lib/prisma';
import { getUserIdFromToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

export default async function AdminDashboard() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return redirect('/');

  let email = null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    email = decoded.email;
  } catch (err) {
    return redirect('/');
  }

  if (email !== process.env.ADMIN_EMAIL) return redirect('/');

  const notes = await prisma.note.findMany({
    include: {
      author: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">🛠️ Admin Panel</h1>

      {notes.map((note: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; subject: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; semester: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; branch: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; year: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; author: { name: any; email: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; fileUrl: string | undefined; }) => (
        <form
          key={note.id}
          action={`/admin/delete-note/${note.id}`}
          method="post"
          className="border p-4 rounded mb-4 shadow"
        >
          <h2 className="font-semibold text-lg">{note.title}</h2>
          <p className="text-sm text-gray-600">
            {note.subject} | Sem: {note.semester} | Branch: {note.branch} | Year: {note.year}
          </p>
          <p className="text-xs text-gray-500">Uploaded by: {note.author?.name || 'Unknown'} ({note.author?.email})</p>
          <a href={note.fileUrl} target="_blank" className="text-blue-600 underline text-sm">
            View / Download
          </a>
          <button
            type="submit"
            className="ml-4 inline-block text-red-600 underline text-sm"
          >
            🗑 Delete
          </button>
        </form>
      ))}
    </div>
  );
}
