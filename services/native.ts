export interface NativeAppData {
  id: string;
  name: string;
  packageName: string;
  dataUsed: number; // in MB
  iconData?: string; // base64 icon
}

export const getNativeAppUsage = async (): Promise<NativeAppData[]> => {
  if (typeof window !== 'undefined' && (window as any).AndroidBridge && (window as any).AndroidBridge.getAppsDataUsage) {
    try {
      // In the real APK, this will call the @JavascriptInterface
      const jsonStr = await (window as any).AndroidBridge.getAppsDataUsage();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse native data', e);
      throw new Error('ParseError');
    }
  }
  throw new Error('NativeBridgeNotAvailable');
};

export const openDeviceSettings = (action: string) => {
  if (typeof window !== 'undefined' && (window as any).AndroidBridge && (window as any).AndroidBridge.openSettings) {
    (window as any).AndroidBridge.openSettings(action);
  } else {
    // Fallback using Intent URI for Android browser environments
    window.location.href = `intent:#Intent;action=${action};end`;
  }
};
