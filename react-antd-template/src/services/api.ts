import httpClient from './request';
import type { User, MenuItem, PaginationParams, PaginationResponse } from '../types';

// 认证相关 API
export const authAPI = {
  // 登录
  login: (credentials: { username: string; password: string }) =>
    httpClient.post<{ token: string; user: User }>('/auth/login', credentials),

  // 登出
  logout: () => httpClient.post('/auth/logout'),

  // 获取用户信息
  getUserInfo: () =>
    httpClient.get<User>('/auth/user', {
      cache: { ttl: 5 * 60 * 1000 }, // 缓存 5 分钟
    }),

  // 刷新 token
  refreshToken: () =>
    httpClient.post<{ token: string }>('/auth/refresh'),

  // 修改密码
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    httpClient.post('/auth/change-password', data),
};

// 菜单相关 API
export const menuAPI = {
  // 获取用户菜单
  getUserMenus: () =>
    httpClient.get<MenuItem[]>('/menu/user', {
      cache: { ttl: 10 * 60 * 1000 }, // 缓存 10 分钟
    }),

  // 获取所有菜单
  getAllMenus: () =>
    httpClient.get<MenuItem[]>('/menu/all'),

  // 创建菜单
  createMenu: (menu: Omit<MenuItem, 'key'>) =>
    httpClient.post<MenuItem>('/menu', menu),

  // 更新菜单
  updateMenu: (key: string, menu: Partial<MenuItem>) =>
    httpClient.put<MenuItem>(`/menu/${key}`, menu),

  // 删除菜单
  deleteMenu: (key: string) =>
    httpClient.delete(`/menu/${key}`),
};

// 用户管理 API
export const userAPI = {
  // 获取用户列表
  getUsers: (params: PaginationParams & { keyword?: string }) =>
    httpClient.get<PaginationResponse<User>>('/users', { params }),

  // 获取用户详情
  getUser: (id: string) =>
    httpClient.get<User>(`/users/${id}`),

  // 创建用户
  createUser: (user: Omit<User, 'id'>) =>
    httpClient.post<User>('/users', user),

  // 更新用户
  updateUser: (id: string, user: Partial<User>) =>
    httpClient.put<User>(`/users/${id}`, user),

  // 删除用户
  deleteUser: (id: string) =>
    httpClient.delete(`/users/${id}`),

  // 重置用户密码
  resetPassword: (id: string, newPassword: string) =>
    httpClient.post(`/users/${id}/reset-password`, { newPassword }),
};

// 文件上传 API
export const uploadAPI = {
  // 上传单个文件
  uploadFile: (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    return httpClient.post<{ url: string; filename: string }>('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },

  // 上传多个文件
  uploadFiles: (files: File[], onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return httpClient.post<{ urls: string[]; filenames: string[] }>('/upload/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },

  // 删除文件
  deleteFile: (filename: string) =>
    httpClient.delete(`/upload/file/${filename}`),
};

// 系统配置 API
export const systemAPI = {
  // 获取系统信息
  getSystemInfo: () =>
    httpClient.get<{
      version: string;
      name: string;
      description: string;
    }>('/system/info', {
      cache: { ttl: 30 * 60 * 1000 }, // 缓存 30 分钟
    }),

  // 获取系统配置
  getSystemConfig: () =>
    httpClient.get<Record<string, any>>('/system/config'),

  // 更新系统配置
  updateSystemConfig: (config: Record<string, any>) =>
    httpClient.put('/system/config', config),
};

// 统计相关 API
export const statisticsAPI = {
  // 获取仪表盘数据
  getDashboardData: () =>
    httpClient.get<{
      userCount: number;
      orderCount: number;
      revenue: number;
      growth: number;
    }>('/statistics/dashboard', {
      cache: { ttl: 2 * 60 * 1000 }, // 缓存 2 分钟
    }),

  // 获取用户统计
  getUserStatistics: (timeRange: string) =>
    httpClient.get<{
      labels: string[];
      data: number[];
    }>('/statistics/users', {
      params: { timeRange },
      cache: { ttl: 5 * 60 * 1000 },
    }),
};