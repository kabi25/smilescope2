"use client"
import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Monitor, Smartphone, Video, ChevronDown } from 'lucide-react';

interface CameraDevice {
  deviceId: string;
  label: string;
  kind: string;
}

export default function CameraFeed() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableDevices, setAvailableDevices] = useState<CameraDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get available camera devices
  const getAvailableDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 8)}...`,
          kind: device.kind
        }));
      
      setAvailableDevices(videoDevices);
      
      // Auto-select the first available device
      if (videoDevices.length > 0 && !selectedDevice) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error getting devices:', err);
      setError('Failed to enumerate camera devices');
    }
  };

  const startCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: false,
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to access camera. Please ensure you have granted camera permissions and the device is connected.');
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

  const switchCamera = async () => {
    if (availableDevices.length > 1) {
      const currentIndex = availableDevices.findIndex(device => device.deviceId === selectedDevice);
      const nextIndex = (currentIndex + 1) % availableDevices.length;
      setSelectedDevice(availableDevices[nextIndex].deviceId);
      
      if (isStreaming) {
        stopCamera();
        setTimeout(startCamera, 300);
      }
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
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        // TODO: Handle the captured image (e.g., save to Firebase)
        console.log('Captured image:', imageData);
      }
    }
  };

  const getDeviceIcon = (device: CameraDevice) => {
    const label = device.label.toLowerCase();
    if (label.includes('external') || label.includes('usb')) return <Monitor className="h-4 w-4" />;
    if (label.includes('front') || label.includes('user')) return <Smartphone className="h-4 w-4" />;
    return <Video className="h-4 w-4" />;
  };

  useEffect(() => {
    getAvailableDevices();
    
    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', getAvailableDevices);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getAvailableDevices);
      stopCamera();
    };
  }, []);

  const selectedDeviceInfo = availableDevices.find(device => device.deviceId === selectedDevice);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Device Selector */}
      <div className="w-full max-w-2xl mb-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900">Camera Device</h3>
            <button
              className="p-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowDeviceSelector(!showDeviceSelector)}
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showDeviceSelector ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {selectedDeviceInfo && (
            <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
              {getDeviceIcon(selectedDeviceInfo)}
              <span>{selectedDeviceInfo.label}</span>
            </div>
          )}
          
          {showDeviceSelector && (
            <div className="space-y-2">
              {availableDevices.map((device) => (
                <button
                  key={device.deviceId}
                  onClick={() => {
                    setSelectedDevice(device.deviceId);
                    setShowDeviceSelector(false);
                    if (isStreaming) {
                      stopCamera();
                      setTimeout(startCamera, 300);
                    }
                  }}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    selectedDevice === device.deviceId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(device)}
                    <span className="text-sm font-medium">{device.label}</span>
                  </div>
                </button>
              ))}
              
              {availableDevices.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No camera devices found. Please connect a camera and refresh.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Camera View */}
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

      {/* Camera Controls */}
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

        {availableDevices.length > 1 && (
          <button
            onClick={switchCamera}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-500 text-white hover:opacity-90"
            title="Switch camera"
          >
            <Video size={20} />
            Switch
          </button>
        )}

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