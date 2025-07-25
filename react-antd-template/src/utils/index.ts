// 深度克隆
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any };
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }
  return obj;
};

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func(...args);
    }
  };
};

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 生成随机字符串
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 检查是否为移动设备
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// 获取设备信息
export const getDeviceInfo = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  return {
    isMobile: width <= 576, // 修改为更小的断点，只有真正的手机才算移动设备
    isTablet: width > 576 && width <= 992,
    isDesktop: width > 992,
    screenWidth: width,
    screenHeight: height,
  };
};

// 存储操作
export const storage = {
  get: (key: string, defaultValue: any = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};

// URL 参数处理
export const urlParams = {
  get: (name: string): string | null => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(name);
  },
  getAll: (): Record<string, string> => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    urlSearchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  },
  set: (params: Record<string, string>) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    Object.entries(params).forEach(([key, value]) => {
      urlSearchParams.set(key, value);
    });
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${urlSearchParams.toString()}`
    );
  },
};

// 权限检查
export const hasPermission = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};