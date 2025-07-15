'use client';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function GalleryAuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      console.log('Gallery AuthGuard user:', user);
      if (user === null) {
        router.replace('/onboarding');
      }
    }
  }, [user, hydrated, router]);

  if (!hydrated || user === undefined) return null; // or a loader
  if (user === null) return null;
  return <>{children}</>;
}

// Custom layout for gallery route to remove sidebar and root layout wrappers
export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 