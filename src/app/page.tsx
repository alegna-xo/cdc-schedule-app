'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-white via-blue-50 to-blue-100">
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/logo.png"
          alt="CDC Logo"
          width={100}
          height={100}
          className="rounded-full shadow-md"
        />
      </div>

      {/* Headline */}
      <h1 className="text-4xl font-bold mb-2 text-gray-800">
        Welcome to CDC Scheduler
      </h1>

      {/* Subtext */}
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        A simple, secure way to check and manage your work schedule.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow"
        >
          Log In
        </Link>
        <Link
          href="/schedule"
          className="bg-white hover:bg-gray-100 text-gray-700 font-medium px-6 py-2 rounded-lg border shadow"
        >
          View Schedule
        </Link>
      </div>
    </main>
  );
}
