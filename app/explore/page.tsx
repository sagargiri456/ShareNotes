import CommentButton from '@/components/CommentButton';
import LikeButton from '@/components/LikeButton';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

interface ExploreNotesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ExploreNotesPage({ searchParams }: ExploreNotesPageProps) {
  const resolvedParams = await searchParams;

  const getString = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const subject = getString(resolvedParams?.subject);
  const semester = getString(resolvedParams?.semester);
  const branch = getString(resolvedParams?.branch);
  const year = getString(resolvedParams?.year);
  const title = getString(resolvedParams?.title);

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

  const branches = [
    "ALL Branch 1st Year", "CSE", "AIDS (AD)", "AIML (AL)", "AI", "AUTO",
    "Auto & Robo", "CHEMICAL", "CIVIL", "CSBS (CB)", "CSE-DS (CD)",
    "CSE-IOT", "CSIT", "3DAG", "IOT", "IS ( IOT-CS)", "CY", "EC", "EE",
    "EEE", "EX", "FT", "IT", "ME", "MINING (MI)", "MM", "Robo & Mech",
    "OTHERS", "TX"
  ];

  const semesters = [
    "1 SEMESTER", "2 SEMESTER", "3 SEMESTER", "4 SEMESTER",
    "5 SEMESTER", "6 SEMESTER", "7 SEMESTER", "8 SEMESTER"
  ];

  const years = ['1', '2', '3', '4'];

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold font-poppins text-gray-800 mb-4 tracking-tight flex items-center gap-2">
        <span className="text-sm">
          <Image width={50} height={50} src="/explore_logo.png" alt="explore_logo" />
        </span>
        Explore Notes
      </h1>

      {/* Filter Form */}
      <form className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 bg-white p-4 rounded shadow">
        <input type="text" name="title" placeholder="Title" defaultValue={title} className="border p-2 rounded text-sm" />
        <input type="text" name="subject" placeholder="Subject" defaultValue={subject} className="border p-2 rounded text-sm" />

        <select name="semester" defaultValue={semester} className="border p-2 rounded text-sm">
          <option value="">Semester</option>
          {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select name="branch" defaultValue={branch} className="border p-2 rounded text-sm">
          <option value="">Branch</option>
          {branches.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>

        <select name="year" defaultValue={year} className="border p-2 rounded text-sm">
          <option value="">Year</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 col-span-2 md:col-span-1 hover:bg-blue-700 transition">
          🔍 Filter
        </button>
      </form>

      {/* Notes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-white hover:scale-[1.02] transition-transform shadow-md rounded-lg p-4 flex flex-col items-center text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{note.title}</h2>

            {/* PDF Preview */}
            <div className="mb-3 w-full">
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

            <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm underline hover:text-blue-800 mb-2">
              View / Download
            </a>

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
