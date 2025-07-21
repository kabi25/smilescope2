// src/app/gallery/[scanNumber]/page.tsx
import dynamic from 'next/dynamic';

const ScanDetailClient = dynamic(() => import('./ScanDetailClient'), { ssr: false });

export default function Page({ params }: { params: { scanNumber: string } }) {
  return <ScanDetailClient scanNumber={params.scanNumber} />;
}
