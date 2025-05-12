'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
      <h1 className="text-6xl font-bold text-blue-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm rounded-md shadow transition"
      >
        Go Back Home
      </Link>
    </main>
  );
}
