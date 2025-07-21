'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { usePathname } from 'next/navigation';
import {  useState } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <AuthProvider>
      <LayoutNoAuthCheck collapsed={collapsed} setCollapsed={setCollapsed}>{children}</LayoutNoAuthCheck>
    </AuthProvider>
  );
}

function LayoutNoAuthCheck({ children, collapsed, setCollapsed }: { children: React.ReactNode, collapsed: boolean, setCollapsed: (c: boolean) => void }) {
  const pathname = usePathname();

  // useEffect(() => {
  //   if (!user) {
  //     router.replace('/');
  //   }
  // }, [user, router]);
  return (
    <div className={`app-container ${collapsed ? 'collapsed' : 'expanded'} flex min-h-screen bg-neutral-50 transition-all duration-300`}>
       <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="main-content flex-grow transition-all duration-300" style={{ marginLeft: pathname !== '/onboarding' ? (collapsed ? 80 : 250) : 0, padding: 0 }}>
        <div className="container mx-auto px-0 py-0">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
      <style jsx global>{`
        .app-container {
          display: flex;
          width: 100vw;
        }
        .main-content {
          transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .app-container.collapsed .main-content {
          margin-left: 80px !important;
        }
        .app-container.expanded .main-content {
          margin-left: 250px !important;
        }
      `}</style>
    </div>
  );
} 