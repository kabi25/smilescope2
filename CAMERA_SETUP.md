# External Camera Setup Guide

This guide explains how to connect and use external camera devices with the SmileScope dental camera app.

## Supported Camera Types

The app supports various types of external cameras:

- **USB Webcams** (Logitech, Microsoft, etc.)
- **HDMI Cameras** (with USB capture devices)
- **IP Cameras** (via browser support)
- **Built-in Laptop/Desktop Cameras**
- **Mobile Device Cameras** (when used as webcam)

## Hardware Requirements

### For USB Cameras:
- USB 2.0 or 3.0 port
- Compatible webcam (most modern webcams work)
- Recommended: 1080p or higher resolution

### For HDMI Cameras:
- HDMI to USB capture device
- HDMI camera source
- USB port for the capture device

## Setup Instructions

### 1. Connect Your Camera

1. **USB Camera:**
   - Plug your USB camera into an available USB port
   - Wait for Windows to install drivers (usually automatic)
   - The camera should appear in Device Manager

2. **HDMI Camera:**
   - Connect your HDMI camera to the capture device
   - Connect the capture device to a USB port
   - Install any required drivers for the capture device

### 2. Browser Permissions

1. Open the SmileScope app in your browser
2. Navigate to the Camera page
3. When prompted, click "Allow" to grant camera permissions
4. If you accidentally denied permissions:
   - Click the camera icon in the browser address bar
   - Select "Allow" for camera access
   - Refresh the page

### 3. Select Your Camera

1. On the Camera page, click the "Camera Device" dropdown
2. You'll see a list of all available cameras
3. External cameras are marked with a monitor icon
4. Click on your external camera to select it
5. The camera will automatically start streaming

## Camera Settings

### Resolution Options:
- **640x480** - Low quality, fast performance
- **1280x720** - HD quality, good balance
- **1920x1080** - Full HD, recommended for dental work
- **4K (3840x2160)** - Ultra HD, requires powerful hardware

### Frame Rate Options:
- **15 fps** - Low frame rate, good for still images
- **24 fps** - Standard video frame rate
- **30 fps** - Smooth motion, recommended
- **60 fps** - High frame rate, requires good hardware

### Photo Quality:
- **Low (50%)** - Smaller file size
- **Medium (70%)** - Good balance
- **High (80%)** - Recommended for dental analysis
- **Maximum (100%)** - Best quality, larger files

## Troubleshooting

### Camera Not Detected

1. **Check Connections:**
   - Ensure the camera is properly connected
   - Try a different USB port
   - Check if the camera works in other applications

2. **Driver Issues:**
   - Update camera drivers
   - Reinstall camera drivers
   - Check Device Manager for errors

3. **Browser Issues:**
   - Try a different browser (Chrome, Firefox, Edge)
   - Clear browser cache and cookies
   - Disable browser extensions that might interfere

### Camera Access Denied

1. **Browser Permissions:**
   - Click the camera icon in the address bar
   - Select "Allow" for camera access
   - Refresh the page

2. **System Permissions:**
   - Check Windows Privacy Settings
   - Go to Settings > Privacy > Camera
   - Ensure "Allow apps to access your camera" is enabled

### Poor Video Quality

1. **Check Camera Settings:**
   - Increase resolution in the app settings
   - Ensure good lighting conditions
   - Clean the camera lens

2. **Hardware Limitations:**
   - Some cameras may not support high resolutions
   - USB 2.0 cameras may have bandwidth limitations
   - Try reducing frame rate for better performance

### Camera Switching Issues

1. **Multiple Cameras:**
   - Use the device selector to choose the correct camera
   - Ensure only one camera is active at a time
   - Check if cameras are being used by other applications

## Best Practices for Dental Photography

### Lighting:
- Use bright, even lighting
- Avoid harsh shadows
- Consider using a ring light for dental work

### Positioning:
- Keep the camera steady
- Maintain consistent distance from subject
- Use the on-screen guidelines for framing

### Image Quality:
- Use 1080p or higher resolution
- Set photo quality to High or Maximum
- Ensure good focus before capturing

### Storage:
- Photos are stored locally in the browser
- Consider backing up important images
- Clear old photos periodically to save space

## Advanced Features

### Device Detection:
- The app automatically detects when cameras are connected/disconnected
- External cameras are prioritized in the device list
- Device names are automatically formatted for better readability

### Auto-Settings:
- The app automatically detects camera capabilities
- Recommended settings are applied based on device capabilities
- Manual adjustments are always available

### Error Handling:
- Clear error messages for common issues
- Automatic retry mechanisms
- Graceful fallback to available cameras

## Support

If you continue to experience issues:

1. Check the browser console for error messages
2. Try the camera in other applications to verify it works
3. Update your browser to the latest version
4. Contact support with specific error details

## Technical Notes

- The app uses the WebRTC MediaDevices API
- Camera access requires HTTPS in production
- Device enumeration requires camera permissions
- Stream constraints are optimized for dental photography 