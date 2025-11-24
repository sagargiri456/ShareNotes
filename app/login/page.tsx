'use client';

import { useState } from 'react';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Login failed');
        return;
      }

      // Store token securely (can use cookies in production)
      localStorage.setItem('token', data.token);
      // router.push('/explore');

      window.location.href = '/explore';

    } catch (_err) {
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-black text-center">Login to Your Account</h2>

        {errorMsg && <p className="text-red-600 text-center text-sm">{errorMsg}</p>}

        <div>
          <label htmlFor="email" className="block text-sm text-black font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-black text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end mt-1">
            <a href="/forgotPassword" className="text-blue-600 hover:text-blue-800 text-sm">
              Forgot Password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-150"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-blue-600 underline hover:text-blue-800">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
