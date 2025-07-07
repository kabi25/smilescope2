'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';

const metadata: Metadata = {
  title: 'Smilescope - Dental Camera Tool',
  description: 'A mobile-first dental camera application for dental health monitoring',
  icons: {
    icon: '/favicon.ico',
  },
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} h-full`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

// ... existing code ... 