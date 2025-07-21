'use client';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ScanHistory {
  scanNumber: number;
  image: string;
  analysis: string;
  date: string;
}

export default function GalleryPage() {
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [lastDeleted, setLastDeleted] = useState<ScanHistory | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('smilescope_scan_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const handleDelete = (scanNumber: number) => {
    const scanToDelete = history.find(scan => scan.scanNumber === scanNumber);
    if (scanToDelete) setLastDeleted(scanToDelete);
    const updated = history.filter(scan => scan.scanNumber !== scanNumber);
    setHistory(updated);
    localStorage.setItem('smilescope_scan_history', JSON.stringify(updated));
  };

  const handleUndo = () => {
    if (lastDeleted) {
      const updated = [...history, lastDeleted].sort((a, b) => a.scanNumber - b.scanNumber);
      setHistory(updated);
      localStorage.setItem('smilescope_scan_history', JSON.stringify(updated));
      setLastDeleted(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-10 text-[#1c788c]">Gallery</h1>
        {lastDeleted && (
          <button
            onClick={handleUndo}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
          >
            Undo Delete
          </button>
        )}
        {history.length === 0 ? (
          <p className="text-gray-500">No scans yet. Take a photo in SmileChat or Camera to see your history here.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {history.map((scan, idx) => (
              <div
                key={scan.scanNumber}
                className="relative rounded-2xl bg-white flex flex-col items-center justify-center w-40 h-40 md:w-48 md:h-48 shadow-lg overflow-hidden cursor-pointer"
                onClick={() => router.push(`/gallery/${scan.scanNumber}`)}
              >
                <img
                  src={scan.image}
                  alt={`Scan ${scan.scanNumber}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-black opacity-40 rounded-2xl" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-2">
                  <div className="text-lg md:text-xl font-bold text-white mb-1 text-center">Scan {idx+1}</div>
                  <div className="text-xs md:text-base font-bold text-white text-center underline underline-offset-2">
                    {new Date(scan.date).toLocaleString()}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(scan.scanNumber); }}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-red-500 hover:text-white text-red-500 rounded-full p-2 transition"
                    title="Delete this scan"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 