'use client'
import Image from 'next/image';
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
     
      const data = await res.json();
   
      setUser(data.user);
    }
    fetchUser();
  }, []);

  const toggleLogout = () => {
    setShowLogout(prev => !prev);
  }
  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      // method: 'POST',
      // credentials: 'include',
    });
    console.log("reached till router.refresh")
    window.location.reload(); // re-renders navbar
  };
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-17">
          <div className="flex items-center">
            <Link href="/" className="text-xl flex justify-center items-center font-semibold text-gray-900">
            <span><Image width={70} height={70} src="/sharenotes.png" alt="main_logo" /></span>
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
                    className="px-4 py-1 rounded-full text-sm font-semibold shadow-lg transition-all duration-200 bg-gradient-to-r from-green-400/60 to-green-600/60 backdrop-blur-md border border-white/30 text-green-900 hover:from-green-500/80 hover:to-green-700/80 hover:scale-105"
                    style={{ boxShadow: '0 4px 30px rgba(34,197,94,0.2)', textShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
                  >
                    {user.name}
                  </button>

                  {showLogout && (
                    <div className="absolute right-2 mt-10 bg-white/10 backdrop-blur-md border border-white/30 rounded shadow p-2 z-10">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-red-400/60 to-red-600/60 text-red-900 shadow-lg backdrop-blur-md border border-white/30 hover:from-red-500/80 hover:to-red-700/80 hover:scale-105 transition-all duration-200"
                        style={{ boxShadow: '0 4px 30px rgba(239,68,68,0.2)', textShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full font-semibold shadow-lg bg-gradient-to-r from-green-400/60 to-green-600/60 text-white backdrop-blur-md border border-white/30 hover:from-green-500/80 hover:to-green-700/80 hover:scale-105 transition-all duration-200"
                  style={{ boxShadow: '0 4px 30px rgba(34,197,94,0.2)' }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 