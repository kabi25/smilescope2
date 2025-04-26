"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera, Repeat, Image as ImageIcon, Settings } from 'lucide-react';

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please make sure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const switchCamera = async () => {
    setIsFrontCamera(!isFrontCamera);
    if (isCameraActive) {
      stopCamera();
      setTimeout(startCamera, 300); // Small delay to ensure camera switches properly
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const photoUrl = canvas.toDataURL('image/jpeg');
        setPhotos(prev => [photoUrl, ...prev]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Camera Header */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">
                Dental Camera
              </h1>
              <p className="mt-1 text-neutral-500">
                Take clear photos of your teeth for professional analysis
              </p>
            </div>
            <button className="btn btn-outline" onClick={() => window.location.href = '/settings'}>
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Camera View */}
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
          
          {/* Camera Guidelines */}
          <div className="absolute inset-0 pointer-events-none border-2 border-white/30 m-8 rounded-lg" />
          
          {/* Camera Controls */}
          <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-center space-x-4 bg-gradient-to-t from-black/50 to-transparent">
            <button
              className="btn bg-white/90 hover:bg-white p-3 rounded-full"
              onClick={switchCamera}
            >
              <Repeat className="h-6 w-6 text-neutral-900" />
            </button>
            
            <button
              className="btn bg-white p-4 rounded-full"
              onClick={isCameraActive ? takePhoto : startCamera}
            >
              <Camera className="h-8 w-8 text-neutral-900" />
            </button>
            
            <button
              className="btn bg-white/90 hover:bg-white p-3 rounded-full"
              onClick={() => window.location.href = '/gallery'}
            >
              <ImageIcon className="h-6 w-6 text-neutral-900" />
            </button>
          </div>
        </div>

        {/* Recent Photos */}
        {photos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              Recent Photos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-video relative rounded-lg overflow-hidden border border-neutral-200 bg-white"
                >
                  <img
                    src={photo}
                    alt={`Dental photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden Canvas for Photo Processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
} 