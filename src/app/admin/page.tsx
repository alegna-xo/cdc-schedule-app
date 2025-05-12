'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';

export default function AdminDashboard() {
  const { role, loading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (role !== 'admin') {
      console.log('🚫 Not an admin. Redirecting to /schedule');
      router.push('/schedule');
    } else {
      console.log('✅ Admin confirmed, staying on /admin');
    }
  }, [role, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading admin dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 text-center mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-center mb-10">
          Manage weekly staff schedules and shifts.
        </p>

        {/* Add Shift Button */}
        <div className="flex justify-end mb-6">
          <button className="px-5 py-2 bg-blue-700 text-white rounded-md shadow hover:bg-blue-800 transition text-sm font-medium">
            + Add Shift
          </button>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto rounded-2xl shadow bg-white border border-gray-100">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Start</th>
                <th className="px-6 py-4">End</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">Aiden Smith</td>
                <td className="px-6 py-4">May 10</td>
                <td className="px-6 py-4">09:00</td>
                <td className="px-6 py-4">17:00</td>
                <td className="px-6 py-4">—</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800" title="Edit">✏️</button>
                  <button className="text-gray-500 hover:text-red-600" title="Delete">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
