'use client';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();

  // Sidebar width: 80px when collapsed, 256px (w-64) when expanded
  const sidebarWidth = collapsed ? 80 : 256;

  return (
    <AuthProvider>
      <div className="app-container flex min-h-screen bg-neutral-50 transition-all duration-300">
        <SidebarWrapper collapsed={collapsed} setCollapsed={setCollapsed} />
        <main
          className="main-content flex-grow transition-all duration-300"
          style={{ marginLeft: pathname !== '/onboarding' ? sidebarWidth : 0, padding: 0 }}
        >
          <div className="container mx-auto px-0 py-0">
            <div className="animate-fade-in">{children}</div>
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
        `}</style>
      </div>
    </AuthProvider>
  );
}

function SidebarWrapper({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (c: boolean) => void }) {
  // Pass collapsed/setCollapsed to Sidebar via context or props if needed for future features
  // For now, Sidebar manages its own hover state, but we sync here for layout
  return <SidebarExternal collapsed={collapsed} setCollapsed={setCollapsed} />;
}

// SidebarExternal is a wrapper to allow passing collapsed/setCollapsed if needed
function SidebarExternal({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (c: boolean) => void }) {
  // Sidebar manages its own hover state, but we want to sync with layout
  // So we listen for mouse enter/leave and update collapsed state
  return <div onMouseEnter={() => setCollapsed(false)} onMouseLeave={() => setCollapsed(true)}><Sidebar /></div>;
} 