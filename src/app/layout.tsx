import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smilescope - Dental Camera Tool',
  description: 'A mobile-first dental camera application for dental health monitoring',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <div className="flex min-h-screen bg-neutral-50">
            <Sidebar />
            <main className="flex-1 md:ml-64">
              <div className="container mx-auto px-4 py-8">
                <div className="animate-fade-in">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 