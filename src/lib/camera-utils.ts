export interface CameraDevice {
  deviceId: string;
  label: string;
  kind: string;
  groupId?: string;
}

export interface CameraConstraints {
  width?: number;
  height?: number;
  frameRate?: number;
  deviceId?: string;
}

export interface CameraSettings {
  resolution: string;
  frameRate: number;
  quality: number;
}

/**
 * Get all available video input devices
 */
export async function getAvailableCameras(): Promise<CameraDevice[]> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter(device => device.kind === 'videoinput')
      .map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Camera ${device.deviceId.slice(0, 8)}...`,
        kind: device.kind,
        groupId: device.groupId
      }));
  } catch (error) {
    console.error('Error enumerating devices:', error);
    return [];
  }
}

/**
 * Create MediaStreamConstraints for a specific camera device
 */
export function createCameraConstraints(
  deviceId: string,
  settings: CameraSettings
): MediaStreamConstraints {
  const [width, height] = settings.resolution.split('x').map(Number);
  
  return {
    video: {
      deviceId: { exact: deviceId },
      width: { ideal: width },
      height: { ideal: height },
      frameRate: { ideal: settings.frameRate }
    },
    audio: false
  };
}

/**
 * Get device icon based on device label
 */
export function getDeviceIcon(device: CameraDevice): 'external' | 'internal' | 'mobile' {
  const label = device.label.toLowerCase();
  
  if (label.includes('external') || label.includes('usb') || label.includes('webcam')) {
    return 'external';
  }
  
  if (label.includes('front') || label.includes('user') || label.includes('selfie')) {
    return 'mobile';
  }
  
  return 'internal';
}

/**
 * Check if a device is an external camera
 */
export function isExternalCamera(device: CameraDevice): boolean {
  const label = device.label.toLowerCase();
  return label.includes('external') || 
         label.includes('usb') || 
         label.includes('webcam') ||
         label.includes('logitech') ||
         label.includes('c920') ||
         label.includes('c922');
}

/**
 * Get camera capabilities for a specific device
 */
export async function getCameraCapabilities(deviceId: string): Promise<MediaTrackCapabilities | null> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } },
      audio: false
    });
    
    const videoTrack = stream.getVideoTracks()[0];
    const capabilities = videoTrack.getCapabilities();
    
    // Stop the stream immediately
    stream.getTracks().forEach(track => track.stop());
    
    return capabilities;
  } catch (error) {
    console.error('Error getting camera capabilities:', error);
    return null;
  }
}

/**
 * Test if a camera device is accessible
 */
export async function testCameraAccess(deviceId: string): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } },
      audio: false
    });
    
    // Stop the stream immediately
    stream.getTracks().forEach(track => track.stop());
    
    return true;
  } catch (error) {
    console.error('Camera access test failed:', error);
    return false;
  }
}

/**
 * Get recommended camera settings based on device capabilities
 */
export async function getRecommendedSettings(deviceId: string): Promise<CameraSettings> {
  const capabilities = await getCameraCapabilities(deviceId);
  
  if (!capabilities) {
    return {
      resolution: '1920x1080',
      frameRate: 30,
      quality: 0.8
    };
  }
  
  // Find the highest supported resolution
  const width = capabilities.width?.max || 1920;
  const height = capabilities.height?.max || 1080;
  const frameRate = capabilities.frameRate?.max || 30;
  
  return {
    resolution: `${width}x${height}`,
    frameRate: Math.min(frameRate, 60), // Cap at 60fps
    quality: 0.8
  };
}

/**
 * Format device label for display
 */
export function formatDeviceLabel(device: CameraDevice): string {
  let label = device.label;
  
  // Remove common prefixes/suffixes
  label = label.replace(/^Camera\s*/i, '');
  label = label.replace(/\([^)]*\)/g, ''); // Remove text in parentheses
  label = label.replace(/\s+/g, ' ').trim(); // Normalize whitespace
  
  // If label is still too long, truncate it
  if (label.length > 30) {
    label = label.substring(0, 27) + '...';
  }
  
  return label || 'Unknown Camera';
}

/**
 * Sort devices by priority (external cameras first, then internal)
 */
export function sortDevicesByPriority(devices: CameraDevice[]): CameraDevice[] {
  return devices.sort((a, b) => {
    const aIsExternal = isExternalCamera(a);
    const bIsExternal = isExternalCamera(b);
    
    if (aIsExternal && !bIsExternal) return -1;
    if (!aIsExternal && bIsExternal) return 1;
    
    // If both are external or both are internal, sort alphabetically
    return a.label.localeCompare(b.label);
  });
} 