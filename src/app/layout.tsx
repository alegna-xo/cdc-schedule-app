// src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'CDC Schedule App',
  description: 'Employee scheduling app for CDC staff',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
