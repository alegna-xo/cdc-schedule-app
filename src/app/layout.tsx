import './globals.css';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
//import { poppins } from '@/lib/fonts'; // only if you're still using this font

export const metadata = {
  title: 'CDC Schedule App',
  description: 'View and manage your CDC schedule',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gradient-to-b from-white via-blue-50 to-blue-100 text-gray-800 antialiased min-h-screen">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
