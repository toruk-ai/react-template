import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { storage } from '../utils';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: storage.get('token'),
    isAuthenticated: false,
    loading: true,
  });

  // 模拟用户数据
  const mockUser: User = {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    avatar: '',
    roles: ['admin'],
    permissions: ['user:read', 'user:create', 'user:update', 'user:delete', 'admin'],
  };

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.get('token');
      if (token) {
        // 模拟验证 token
        try {
          await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
          setAuthState({
            user: mockUser,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          // Token 无效，清除本地存储
          storage.remove('token');
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    };

    initAuth();
  }, []);

  // 登录
  const login = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      // 模拟 API 请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 简单的模拟验证
      if (credentials.username === 'admin' && credentials.password === '123456') {
        const token = 'mock-jwt-token-' + Date.now();
        
        storage.set('token', token);
        setAuthState({
          user: mockUser,
          token,
          isAuthenticated: true,
          loading: false,
        });
        
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: false, error: '用户名或密码错误' };
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: false, error: error.message };
    }
  }, []);

  // 登出
  const logout = useCallback(async () => {
    try {
      // 这里可以调用登出 API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      storage.remove('token');
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }, []);

  // 更新用户信息
  const updateUser = useCallback((user: User) => {
    setAuthState(prev => ({ ...prev, user }));
  }, []);

  // 刷新用户信息
  const refreshUserInfo = useCallback(async () => {
    if (!authState.token) return;
    
    try {
      // 模拟 API 请求
      await new Promise(resolve => setTimeout(resolve, 500));
      setAuthState(prev => ({ ...prev, user: mockUser }));
    } catch (error) {
      console.error('Refresh user info error:', error);
    }
  }, [authState.token]);

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    login,
    logout,
    updateUser,
    refreshUserInfo,
  };
};

export default useAuth;