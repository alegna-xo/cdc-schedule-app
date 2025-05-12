'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/logo.png"
          alt="CDC Logo"
          width={100}
          height={100}
          className="rounded-full shadow-lg"
        />
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
        Welcome to the CDC Schedule App
      </h1>

      {/* Subtext */}
      <p className="text-gray-600 text-lg max-w-md mb-8">
        A modern, secure way to check and manage your work schedule.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md">
        <Link
          href="/login"
          className="flex-1 text-center px-6 py-3 rounded-lg bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition"
        >
          Log In
        </Link>
        <Link
          href="/schedule"
          className="flex-1 text-center px-6 py-3 rounded-lg border border-blue-700 text-blue-700 font-semibold shadow hover:bg-blue-50 transition"
        >
          View Schedule
        </Link>
      </div>
    </main>
  );
}
