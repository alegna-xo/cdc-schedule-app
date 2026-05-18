'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SchedulePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!user) return;
      const snapshot = await getDocs(collection(db, `users/${user.uid}/schedules`));
      const scheduleData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by date (just in case)
      scheduleData.sort((a, b) => new Date(a.date) - new Date(b.date));

      setSchedules(scheduleData);
    };

    fetchSchedule();
  }, [user]);

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

          {schedules.length === 0 ? (
            <p className="text-gray-500 italic">No shifts found yet.</p>
          ) : (
            <ul className="space-y-5 text-sm sm:text-base text-gray-700">
              {schedules.map((shift) => {
                const date = new Date(shift.date);
                const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
                const formattedDate = date.toLocaleDateString();

                return (
                  <li key={shift.id} className="flex justify-between border-b pb-3 last:border-none">
                    <span className="font-medium">{weekday} ({formattedDate})</span>
                    <span className={`text-right ${/off/i.test(shift.raw) ? 'italic text-gray-400' : 'font-medium'}`}>
                      {shift.raw}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
