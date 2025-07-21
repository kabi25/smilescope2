"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera, Repeat, Image as ImageIcon, Monitor, Smartphone, Video, ChevronDown } from 'lucide-react';

interface CameraDevice {
  deviceId: string;
  label: string;
  kind: string;
}

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [availableDevices, setAvailableDevices] = useState<CameraDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [cameraSettings, setCameraSettings] = useState({
    resolution: '1920x1080',
    frameRate: 30,
    quality: 0.8
  });

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
    }
  };

  useEffect(() => {
    getAvailableDevices();
    
    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', getAvailableDevices);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getAvailableDevices);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          width: { ideal: parseInt(cameraSettings.resolution.split('x')[0]) },
          height: { ideal: parseInt(cameraSettings.resolution.split('x')[1]) },
          frameRate: { ideal: cameraSettings.frameRate }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please make sure you have granted camera permissions and the device is connected.');
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
    if (availableDevices.length > 1) {
      const currentIndex = availableDevices.findIndex(device => device.deviceId === selectedDevice);
      const nextIndex = (currentIndex + 1) % availableDevices.length;
      setSelectedDevice(availableDevices[nextIndex].deviceId);
      
      if (isCameraActive) {
        stopCamera();
        setTimeout(startCamera, 300);
      }
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
        
        const photoUrl = canvas.toDataURL('image/jpeg', cameraSettings.quality);
        setPhotos(prev => [photoUrl, ...prev]);
      }
    }
  };

  const getDeviceIcon = (device: CameraDevice) => {
    const label = device.label.toLowerCase();
    if (label.includes('external') || label.includes('usb')) return <Monitor className="h-4 w-4" />;
    if (label.includes('front') || label.includes('user')) return <Smartphone className="h-4 w-4" />;
    return <Video className="h-4 w-4" />;
  };

  const selectedDeviceInfo = availableDevices.find(device => device.deviceId === selectedDevice);

  return (
    <div>
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
                {selectedDeviceInfo && (
                  <p className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                    {getDeviceIcon(selectedDeviceInfo)}
                    {selectedDeviceInfo.label}
                  </p>
                )}
              </div>
              {/* Remove the button that links to /settings */}
            </div>
          </div>

          {/* Device Selector */}
          <div className="card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-neutral-900">Camera Device</h3>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setShowDeviceSelector(!showDeviceSelector)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${showDeviceSelector ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {showDeviceSelector && (
              <div className="mt-4 space-y-2">
                {availableDevices.map((device) => (
                  <button
                    key={device.deviceId}
                    onClick={() => {
                      setSelectedDevice(device.deviceId);
                      setShowDeviceSelector(false);
                      if (isCameraActive) {
                        stopCamera();
                        setTimeout(startCamera, 300);
                      }
                    }}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      selectedDevice === device.deviceId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(device)}
                      <span className="text-sm font-medium">{device.label}</span>
                    </div>
                  </button>
                ))}
                
                {availableDevices.length === 0 && (
                  <p className="text-sm text-neutral-500 text-center py-4">
                    No camera devices found. Please connect a camera and refresh.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Camera Settings */}
          <div className="card">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Camera Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Resolution
                </label>
                <select
                  value={cameraSettings.resolution}
                  onChange={(e) => setCameraSettings(prev => ({ ...prev, resolution: e.target.value }))}
                  className="w-full p-2 border border-neutral-300 rounded-md"
                >
                  <option value="640x480">640x480</option>
                  <option value="1280x720">1280x720</option>
                  <option value="1920x1080">1920x1080</option>
                  <option value="3840x2160">4K (3840x2160)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Frame Rate
                </label>
                <select
                  value={cameraSettings.frameRate}
                  onChange={(e) => setCameraSettings(prev => ({ ...prev, frameRate: parseInt(e.target.value) }))}
                  className="w-full p-2 border border-neutral-300 rounded-md"
                >
                  <option value={15}>15 fps</option>
                  <option value={24}>24 fps</option>
                  <option value={30}>30 fps</option>
                  <option value={60}>60 fps</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Photo Quality
                </label>
                <select
                  value={cameraSettings.quality}
                  onChange={(e) => setCameraSettings(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
                  className="w-full p-2 border border-neutral-300 rounded-md"
                >
                  <option value={0.5}>Low (50%)</option>
                  <option value={0.7}>Medium (70%)</option>
                  <option value={0.8}>High (80%)</option>
                  <option value={1.0}>Maximum (100%)</option>
                </select>
              </div>
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
                disabled={availableDevices.length <= 1}
                title={availableDevices.length <= 1 ? "No other cameras available" : "Switch camera"}
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
    </div>
  );
} 