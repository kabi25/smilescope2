'use client';

// Custom layout for gallery route to remove sidebar and root layout wrappers
export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 