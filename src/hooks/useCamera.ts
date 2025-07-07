import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  CameraDevice, 
  CameraSettings, 
  getAvailableCameras, 
  createCameraConstraints,
  sortDevicesByPriority,
  getRecommendedSettings,
  testCameraAccess
} from '@/lib/camera-utils';

interface UseCameraReturn {
  // State
  isStreaming: boolean;
  selectedDevice: string;
  availableDevices: CameraDevice[];
  currentSettings: CameraSettings;
  error: string | null;
  
  // Actions
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  switchCamera: () => Promise<void>;
  selectDevice: (deviceId: string) => Promise<void>;
  updateSettings: (settings: Partial<CameraSettings>) => void;
  refreshDevices: () => Promise<void>;
  
  // Refs
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function useCamera(): UseCameraReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [availableDevices, setAvailableDevices] = useState<CameraDevice[]>([]);
  const [currentSettings, setCurrentSettings] = useState<CameraSettings>({
    resolution: '1920x1080',
    frameRate: 30,
    quality: 0.8
  });
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get available devices
  const refreshDevices = useCallback(async () => {
    try {
      const devices = await getAvailableCameras();
      const sortedDevices = sortDevicesByPriority(devices);
      setAvailableDevices(sortedDevices);
      
      // Auto-select first device if none selected
      if (sortedDevices.length > 0 && !selectedDevice) {
        setSelectedDevice(sortedDevices[0].deviceId);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error refreshing devices:', err);
      setError('Failed to enumerate camera devices');
    }
  }, [selectedDevice]);

  // Start camera stream
  const startCamera = useCallback(async () => {
    if (!selectedDevice) {
      setError('No camera device selected');
      return;
    }

    try {
      // Test device access first
      const isAccessible = await testCameraAccess(selectedDevice);
      if (!isAccessible) {
        setError('Selected camera is not accessible. Please check permissions and connection.');
        return;
      }

      const constraints = createCameraConstraints(selectedDevice, currentSettings);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error starting camera:', err);
      setError('Failed to start camera. Please check permissions and device connection.');
    }
  }, [selectedDevice, currentSettings]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Switch to next available camera
  const switchCamera = useCallback(async () => {
    if (availableDevices.length <= 1) return;

    const currentIndex = availableDevices.findIndex(device => device.deviceId === selectedDevice);
    const nextIndex = (currentIndex + 1) % availableDevices.length;
    const nextDevice = availableDevices[nextIndex];
    
    await selectDevice(nextDevice.deviceId);
  }, [availableDevices, selectedDevice]);

  // Select specific device
  const selectDevice = useCallback(async (deviceId: string) => {
    setSelectedDevice(deviceId);
    
    // Get recommended settings for the new device
    try {
      const recommendedSettings = await getRecommendedSettings(deviceId);
      setCurrentSettings(prev => ({
        ...prev,
        resolution: recommendedSettings.resolution,
        frameRate: recommendedSettings.frameRate
      }));
    } catch (err) {
      console.error('Error getting recommended settings:', err);
    }
    
    // Restart camera if currently streaming
    if (isStreaming) {
      stopCamera();
      setTimeout(startCamera, 300);
    }
  }, [isStreaming, startCamera, stopCamera]);

  // Update camera settings
  const updateSettings = useCallback((newSettings: Partial<CameraSettings>) => {
    setCurrentSettings(prev => ({ ...prev, ...newSettings }));
    
    // Restart camera with new settings if currently streaming
    if (isStreaming) {
      stopCamera();
      setTimeout(startCamera, 300);
    }
  }, [isStreaming, startCamera, stopCamera]);

  // Initialize devices on mount
  useEffect(() => {
    refreshDevices();
    
    // Listen for device changes
    const handleDeviceChange = () => {
      refreshDevices();
    };
    
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      stopCamera();
    };
  }, [refreshDevices, stopCamera]);

  return {
    // State
    isStreaming,
    selectedDevice,
    availableDevices,
    currentSettings,
    error,
    
    // Actions
    startCamera,
    stopCamera,
    switchCamera,
    selectDevice,
    updateSettings,
    refreshDevices,
    
    // Refs
    videoRef
  };
} 