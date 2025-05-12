'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { role } = useUserRole();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="CDC Logo"
          width={36}
          height={36}
          className="rounded-full"
        />
        <Link href="/" className="text-lg font-semibold text-blue-700 hover:underline">
          CDC Schedule App
        </Link>
      </div>

      {/* Links */}
      <div className="flex items-center gap-5 text-sm text-gray-700">
        <Link href="/" className="hover:text-blue-600 transition">Home</Link>
        <Link href="/schedule" className="hover:text-blue-600 transition">Schedule</Link>

        {user && role === 'admin' && (
          <Link href="/admin" className="hover:text-blue-600 transition">Admin</Link>
        )}

        {user ? (
          <>
            <span className="text-gray-500 hidden sm:inline">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 font-medium transition"
            >
              Log out
            </button>
          </>
        ) : (
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
