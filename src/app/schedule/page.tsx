'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SchedulePage() {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user || roleLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Schedule</h1>
      <p>Welcome back, {user.email}!</p>
      <p className="mt-2 text-blue-600 font-semibold">ROLE IS: {role}</p>

      {role === 'admin' ? (
        <div className="mt-4">
          <Link href="/admin">
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Manage Schedules
            </button>
          </Link>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">You have employee access only.</p>
      )}
    </main>
  );
}
