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
    return <p className="text-center mt-10 text-gray-500">Loading admin dashboard...</p>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">Admin Dashboard</h1>
      <p className="text-center text-gray-600 mb-8">
        Manage weekly staff schedules and shifts.
      </p>

      {/* Add Shift Button */}
      <div className="flex justify-end mb-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
          + Add Shift
        </button>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Start</th>
              <th className="px-6 py-4">End</th>
              <th className="px-6 py-4">Notes</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t hover:bg-gray-50">
              <td className="px-6 py-4">Aiden Smith</td>
              <td className="px-6 py-4">May 10</td>
              <td className="px-6 py-4">09:00</td>
              <td className="px-6 py-4">17:00</td>
              <td className="px-6 py-4">—</td>
              <td className="px-6 py-4 text-center space-x-2">
                <button className="text-blue-600 hover:text-blue-800" title="Edit">
                  ✏️
                </button>
                <button className="text-gray-600 hover:text-red-600" title="Delete">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
