import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              ShareNotes
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/explore" className="text-gray-700 hover:text-gray-900">
              Explore
            </Link>
            <Link href="/my-notes" className="text-gray-700 hover:text-gray-900">
              My Notes
            </Link>
            <Link href="/upload" className="text-gray-700 hover:text-gray-900">
              Upload
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 