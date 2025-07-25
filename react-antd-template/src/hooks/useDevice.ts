import { useState, useEffect } from 'react';
import type { DeviceInfo } from '../types';
import { getDeviceInfo } from '../utils';

const useDevice = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo());

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
};

export default useDevice;