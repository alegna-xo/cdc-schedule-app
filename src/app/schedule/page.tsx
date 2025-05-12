'use client';
/*export const viewport = {
  width: 'device-width',
  initialScale: 1,
};
*/


import { useAuth } from '@/hooks/useAuth';
//import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SchedulePage() {
  const { user, loading } = useAuth();
  //const { role, loading: roleLoading } = useUserRole(user ?? null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user /*|| roleLoading*/) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">My Schedule</h1>
        <p className="text-gray-600 mb-8">Welcome back, <span className="font-medium">{user.email}</span>!</p>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">This Week</h2>

          <ul className="space-y-4 text-sm text-gray-700">
            <li className="flex justify-between border-b pb-2">
              <span className="font-medium">Monday</span>
              <span>9:00 AM – 5:00 PM</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="font-medium">Tuesday</span>
              <span>11:00 AM – 7:00 PM</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="font-medium">Wednesday</span>
              <span>OFF</span>
            </li>
            <li className="flex justify-between border-b pb-2">
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
