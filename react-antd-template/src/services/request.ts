import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { message } from 'antd';
import { storage } from '../utils';
import type { ApiResponse } from '../types';

// 请求缓存接口
interface CacheConfig {
  ttl?: number; // 缓存时间（毫秒）
  key?: string; // 缓存键名
}

interface CachedData {
  data: any;
  timestamp: number;
  ttl: number;
}

// 请求缓存管理器
class RequestCache {
  private cache = new Map<string, CachedData>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // 生成缓存键
  generateKey(config: AxiosRequestConfig): string {
    const { method, url, params, data } = config;
    return `${method}_${url}_${JSON.stringify(params || {})}_${JSON.stringify(data || {})}`;
  }
}

// 创建请求实例
class HttpClient {
  private instance: AxiosInstance;
  private cache: RequestCache;

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || '/api') {
    this.cache = new RequestCache();
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加认证 token
        const token = storage.get('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 检查缓存
        const cacheConfig = config.metadata?.cache as CacheConfig;
        if (cacheConfig && config.method === 'get') {
          const cacheKey = cacheConfig.key || this.cache.generateKey(config);
          const cachedData = this.cache.get(cacheKey);
          if (cachedData) {
            return Promise.reject({
              isCached: true,
              data: cachedData,
            });
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { config, data } = response;
        
        // 缓存响应数据
        const cacheConfig = config.metadata?.cache as CacheConfig;
        if (cacheConfig && config.method === 'get') {
          const cacheKey = cacheConfig.key || this.cache.generateKey(config);
          this.cache.set(cacheKey, data, cacheConfig.ttl);
        }

        // 统一处理响应
        if (data.code === 200 || data.success) {
          return response;
        } else {
          message.error(data.message || '请求失败');
          return Promise.reject(data);
        }
      },
      (error) => {
        // 处理缓存命中
        if (error.isCached) {
          return Promise.resolve({
            data: error.data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          });
        }

        // 处理不同类型的错误
        if (error.response) {
          const { status, data } = error.response;
          
          switch (status) {
            case 401:
              message.error('未授权，请重新登录');
              storage.remove('token');
              window.location.href = '/login';
              break;
            case 403:
              message.error('权限不足');
              break;
            case 404:
              message.error('请求的资源不存在');
              break;
            case 500:
              message.error('服务器内部错误');
              break;
            default:
              message.error(data?.message || '请求失败');
          }
        } else if (error.request) {
          message.error('网络错误，请检查您的网络连接');
        } else {
          message.error('请求配置错误');
        }

        return Promise.reject(error);
      }
    );
  }

  // GET 请求
  get<T = any>(
    url: string,
    config?: AxiosRequestConfig & { cache?: CacheConfig }
  ): Promise<ApiResponse<T>> {
    return this.instance.get(url, {
      ...config,
      metadata: { cache: config?.cache },
    });
  }

  // POST 请求
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.instance.post(url, data, config);
  }

  // PUT 请求
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.instance.put(url, data, config);
  }

  // DELETE 请求
  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.instance.delete(url, config);
  }

  // 清除缓存
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // 获取实例
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// 扩展 AxiosRequestConfig 类型
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      cache?: CacheConfig;
    };
  }
}

// 创建并导出请求实例
const httpClient = new HttpClient();

export default httpClient;
export { RequestCache };
export type { CacheConfig };