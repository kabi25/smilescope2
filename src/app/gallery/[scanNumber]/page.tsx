'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Trash2, ArrowLeft } from 'lucide-react';

interface ScanHistory {
  scanNumber: number;
  image: string;
  analysis: string;
  date: string;
}

export default function ScanDetailPage() {
  const { scanNumber } = useParams();
  const router = useRouter();
  const [scan, setScan] = useState<ScanHistory | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('smilescope_scan_history');
    if (stored) {
      const history: ScanHistory[] = JSON.parse(stored);
      const found = history.find(s => s.scanNumber === Number(scanNumber));
      if (found) setScan(found);
      else setNotFound(true);
    } else {
      setNotFound(true);
    }
  }, [scanNumber]);

  const handleDelete = () => {
    if (!scan) return;
    const stored = localStorage.getItem('smilescope_scan_history');
    if (stored) {
      const history: ScanHistory[] = JSON.parse(stored);
      const updated = history.filter(s => s.scanNumber !== scan.scanNumber);
      localStorage.setItem('smilescope_scan_history', JSON.stringify(updated));
    }
    router.push('/gallery');
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Scan Not Found</div>
          <button onClick={() => router.push('/gallery')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition">
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  if (!scan) return null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-full md:w-1/2 flex-shrink-0 flex justify-center">
          <img src={scan.image} alt={`Scan ${scan.scanNumber}`} className="w-full max-w-xs h-64 object-cover rounded-xl" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <button onClick={() => router.push('/gallery')} className="flex items-center gap-2 mb-4 text-blue-600 hover:underline self-start">
            <ArrowLeft className="w-5 h-5" /> Back to Gallery
          </button>
          <div className="text-2xl font-bold mb-1 text-[#1c788c]">Scan {scan.scanNumber}</div>
          <div className="text-sm text-gray-500 mb-4">{new Date(scan.date).toLocaleString()}</div>
          <div className="mb-4">
            <div className="text-lg font-bold text-[#1c788c] mb-1">Diagnosis & Recommendations:</div>
            <div className="whitespace-pre-line text-gray-800 bg-gray-50 rounded-lg p-3 border border-gray-200">
              {scan.analysis}
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition flex items-center gap-2 self-start"
          >
            <Trash2 className="w-5 h-5" /> Delete Scan
          </button>
        </div>
      </div>
    </div>
  );
} 