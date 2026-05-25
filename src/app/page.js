import { redirect } from 'next/navigation';
 
/**
 * Root route — redirects to /login.
 * When auth is added in Phase 2, this will check session
 * and route to /schedule (employee) or /admin (admin) if already logged in.
 */
export default function RootPage() {
  redirect('/login');
}