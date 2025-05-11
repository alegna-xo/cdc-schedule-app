'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import ShiftList from '@/components/ShiftList';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user);
  const router = useRouter();

  useEffect(() => {
    console.log('🧠 Redirect useEffect');
    console.log('loading:', loading);
    console.log('roleLoading:', roleLoading);
    console.log('user:', user);
    console.log('role:', role);
  
    // 🚨 Only redirect if role is NOT null and not 'admin'
    if (!loading && !roleLoading && role !== null && role !== 'admin') {
      console.warn('💥 REDIRECT TRIGGERED');
      router.push('/schedule');
    }
  }, [loading, roleLoading, role, user, router]);
  

  if (loading || roleLoading || !user) {
    return <p>Loading...</p>;
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-purple-700">Admin Dashboard</h1>
      <p>Welcome, admin! Here’s where you’ll manage the weekly schedule.</p>
  
      <ShiftList />
    </main>
  )
}