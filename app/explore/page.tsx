import CommentButton from '@/components/CommentButton';
import LikeButton from '@/components/LikeButton';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link'; // Make sure this import is present

interface ExploreNotesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const PAGE_SIZE = 9; // Number of notes to show per page

export default async function ExploreNotesPage({ searchParams }: ExploreNotesPageProps) {
  // All your logic for fetching data, calculating pagination, etc.
  // ... (Your existing code up to createPageURL function) ...

  const resolvedParams = await searchParams;

  const getString = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const subject = getString(resolvedParams?.subject);
  const semester = getString(resolvedParams?.semester);
  const branch = getString(resolvedParams?.branch);
  const year = getString(resolvedParams?.year);
  const title = getString(resolvedParams?.title);

  const currentPage = Number(getString(resolvedParams?.page)) || 1;
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [notes, totalNotes] = await prisma.$transaction([
    prisma.note.findMany({
      where: {
        subject: subject || undefined,
        semester: semester || undefined,
        branch: branch || undefined,
        year: year || undefined,
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
      },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } },
      take: PAGE_SIZE,
      skip: skip,
    }),
    prisma.note.count({
      where: {
        subject: subject || undefined,
        semester: semester || undefined,
        branch: branch || undefined,
        year: year || undefined,
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
      },
    }),
  ]);

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
  const totalPages = Math.ceil(totalNotes / PAGE_SIZE);

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(resolvedParams as Record<string, string>);
    params.set('page', String(pageNumber));
    return `?${params.toString()}`;
  };

  // The actual return statement for the JSX
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

      {/* Notes Grid */}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {/* Previous Page Link */}
          <Link
            href={createPageURL(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={`px-4 py-2 border rounded-md text-sm ${
              currentPage <= 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-gray-50'
            }`}
          >
            Previous
          </Link>

          {/* Page Number Links */}
          {[...Array(totalPages)].map((_, index) => (
          
  
            <Link
              key={index}
              href={createPageURL(index + 1)}
              className={`px-4 py-2 border rounded-md text-sm ${
                currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </Link>
          ))}

          {/* Next Page Link */}
          <Link
            href={createPageURL(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            className={`px-4 py-2 border rounded-md text-sm ${
              currentPage >= totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-gray-50'
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}


{
  /**
   I implemented the pagination logic by modifying the Next.js component to handle page numbers from the URL and adjusting the Prisma query to fetch a specific subset of notes. The key steps were:

1. Handling URL Parameters and Prisma Queries
First, I defined a constant PAGE_SIZE to determine how many notes to display on each page (e.g., 9 notes). Then, I extracted the current page number from the searchParams object provided by Next.js. I used a default value of 1 if no page number was found.

The core of the logic is calculating the skip value for the Prisma query. The skip value tells the database how many records to bypass before it starts returning results. The formula is:

skip = (currentPage - 1) * PAGE_SIZE

For example, on the first page (currentPage = 1), skip would be (1-1) * 9 = 0. On the second page, skip would be (2-1) * 9 = 9, so the query skips the first 9 results and starts fetching from the 10th one.

To get the total number of pages, I needed the total count of notes that match the current filters. I used prisma.$transaction to perform two queries simultaneously:

prisma.note.findMany with the take and skip parameters to fetch the notes for the current page.

prisma.note.count to get the total number of filtered notes.

The total number of pages is then calculated using Math.ceil(totalNotes / PAGE_SIZE). This ensures that any remaining notes on the last page are included.

2. Building the Pagination UI and Links
After fetching the data, I rendered the notes for the current page. Below the notes, I added a set of pagination controls using Next.js's <Link> component.

To create the pagination links, I used a helper function called createPageURL(pageNumber). This function is crucial because it generates a new URL that preserves all the existing filter parameters (like subject, semester, etc.) while only updating the page number. This ensures that when a user clicks to page 2, their filters remain active.

The UI consists of:

"Previous" and "Next" buttons: These links are disabled and styled differently when the user is on the first or last page.

Page number buttons: These are dynamically generated based on totalPages. The button corresponding to the currentPage is highlighted to give the user a clear indication of their current position.
   */
}