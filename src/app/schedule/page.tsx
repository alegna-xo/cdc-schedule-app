'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SchedulePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-16 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-4">
          My Schedule
        </h1>
        <p className="text-gray-600 text-base sm:text-lg mb-10">
          Welcome back, <span className="font-medium">{user.email}</span>!
        </p>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            This Week
          </h2>

          <ul className="space-y-5 text-sm sm:text-base text-gray-700">
            <li className="flex justify-between border-b pb-3">
              <span className="font-medium">Monday</span>
              <span>9:00 AM – 5:00 PM</span>
            </li>
            <li className="flex justify-between border-b pb-3">
              <span className="font-medium">Tuesday</span>
              <span>11:00 AM – 7:00 PM</span>
            </li>
            <li className="flex justify-between border-b pb-3">
              <span className="font-medium">Wednesday</span>
              <span className="italic text-gray-500">OFF</span>
            </li>
            <li className="flex justify-between border-b pb-3">
              <span className="font-medium">Thursday</span>
              <span>9:00 AM – 5:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Friday</span>
              <span>10:00 AM – 6:00 PM</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
