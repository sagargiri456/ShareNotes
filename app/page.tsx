import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          📚 Welcome to ShareNotes
        </h1>
        <p className="text-gray-600 text-lg">
          Share and explore study notes with students across all branches and semesters.
          Upload your PDFs, browse public notes, or access your uploaded materials anytime.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link href="/upload">
            <span className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
              📤 Upload Notes
            </span>
          </Link>

          <Link href="/my-notes">
            <span className="bg-white border text-yellow-500 border-black px-6 py-2 rounded-lg hover:bg-gray-100 transition">
              📁 My Notes
            </span>
          </Link>

          <Link href="/explore">
            <span className="bg-white border text-blue-500 border-black px-6 py-2 rounded-lg hover:bg-gray-100 transition">
              🌍 Explore Notes
            </span>
          </Link>
        </div>

        <footer className="pt-10 text-sm text-gray-500">
          Made with ❤️ by Sagar | Built using Next.js, Prisma, UploadThing & JWT
        </footer>
      </div>
    </main>
  );
}
