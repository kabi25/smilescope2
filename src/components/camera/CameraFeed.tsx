"use client"
import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff } from 'lucide-react';

export default function CameraFeed() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to access camera. Please ensure you have granted camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        // TODO: Handle the captured image (e.g., save to Firebase)
        console.log('Captured image:', imageData);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="relative w-full max-w-2xl aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <p className="text-white text-center">
              {error || 'Camera is not active'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={isStreaming ? stopCamera : startCamera}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-white
            ${isStreaming ? 'bg-red-500' : 'bg-blue-500'} hover:opacity-90`}
        >
          {isStreaming ? (
            <>
              <CameraOff size={20} />
              Stop Camera
            </>
          ) : (
            <>
              <Camera size={20} />
              Start Camera
            </>
          )}
        </button>

        {isStreaming && (
          <button
            onClick={capturePhoto}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-500 text-white hover:opacity-90"
          >
            <Camera size={20} />
            Capture Photo
          </button>
        )}
      </div>
    </div>
  );
} 