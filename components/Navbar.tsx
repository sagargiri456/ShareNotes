'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogout, setShowLogout] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/me');
      console.log(res);
      const data = await res.json();
      console.log(data);
      setUser(data.user);
    }
    fetchUser();
  }, []);

  const toggleLogout = () => {
    setShowLogout(prev => !prev);
  }
  
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-17">
          <div className="flex items-center">
            <Link href="/" className="text-xl flex justify-center items-center font-semibold text-gray-900">
            <span><img style={{width:'5rem', height:'5rem'}} src="sharenotes.png" alt="main_logo" /></span>
              Share<span className='text-red-500'>Notes</span>
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
            <div className="relative">
              {user ? (
                <div className="flex flex-col items-end">
                  <button
                    onClick={toggleLogout}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
                  >
                    {user.name}
                  </button>

                  {showLogout && (
                    <div className="absolute right-2 mt-10 bg-white border rounded shadow p-2 z-10">
                     <Link href="/api/auth/logout" className="text-red-600 text-sm">Logout</Link>
                  </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="text-blue-600">Login</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 