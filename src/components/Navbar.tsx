'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
   const { role } = user ? useUserRole() : { role: null };  // Use condition here
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="CDC Logo" width={40} height={40} />
        <Link href="/" className="text-xl font-semibold text-blue-700">
          CDC Schedule App
        </Link>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-700">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <Link href="/schedule" className="hover:text-blue-600">Schedule</Link>
        {role === 'admin' && (
          <Link href="/admin" className="hover:text-blue-600">Admin</Link>
        )}
        {user && (
          <>
            <span className="text-gray-500 hidden sm:inline">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-red-500 font-medium hover:underline"
            >
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
