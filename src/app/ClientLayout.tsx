'use client';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutWithAuthCheck>{children}</LayoutWithAuthCheck>
    </AuthProvider>
  );
}

function LayoutWithAuthCheck({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   if (!user) {
  //     router.replace('/');
  //   }
  // }, [user, router]);
  return (
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
  );
} 