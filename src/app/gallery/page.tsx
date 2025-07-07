'use client';
import { useEffect, useState } from 'react';

interface ScanHistory {
  scanNumber: number;
  image: string;
  analysis: string;
  date: string;
}

export default function GalleryPage() {
  const [history, setHistory] = useState<ScanHistory[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('smilescope_scan_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Gallery</h1>
        {history.length === 0 ? (
          <p className="text-gray-500">No scans yet. Take a photo in SmileChat or Camera to see your history here.</p>
        ) : (
          <div className="space-y-8">
            {history.map((scan) => (
              <div key={scan.scanNumber} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-6 items-start">
                <div>
                  <img src={scan.image} alt={`Scan ${scan.scanNumber}`} className="w-48 h-48 object-cover rounded mb-2 border" />
                  <a href={scan.image} download={`smilescope_scan_${scan.scanNumber}.png`} className="text-blue-600 underline text-sm">Download</a>
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="font-semibold">Scan {scan.scanNumber}</span>
                    <span className="ml-4 text-gray-500 text-sm">{new Date(scan.date).toLocaleString()}</span>
                  </div>
                  <div className="prose max-w-none">
                    <strong>Diagnosis & Recommendations:</strong>
                    <div className="mt-1 whitespace-pre-line">{scan.analysis}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 