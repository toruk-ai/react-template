import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PermissionRoute from '../components/auth/PermissionRoute';
import Loading from '../components/common/Loading';

// 懒加载页面组件
const Login = React.lazy(() => import('../pages/Login'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const TestLayout = React.lazy(() => import('../pages/TestLayout'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// 页面加载组件
const PageLoading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<Loading />}>
    {children}
  </Suspense>
);

// 创建路由配置
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PageLoading>
        <Login />
      </PageLoading>
    ),
  },
  {
    path: '/',
    element: (
      <PermissionRoute requireAuth>
        <MainLayout />
      </PermissionRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
          element: (
            <PageLoading>
              <Dashboard />
            </PageLoading>
          ),
        },
        {
          path: 'test-layout',
          element: (
            <PageLoading>
              <TestLayout />
            </PageLoading>
          ),
        },
      {
        path: 'users',
        element: (
          <PermissionRoute permissions={['user:read']}>
            <PageLoading>
              <div>用户管理页面 - 需要 user:read 权限</div>
            </PageLoading>
          </PermissionRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <PageLoading>
            <div>个人中心</div>
          </PageLoading>
        ),
      },
      {
        path: 'settings',
        element: (
          <PermissionRoute permissions={['admin']}>
            <PageLoading>
              <div>系统设置 - 需要管理员权限</div>
            </PageLoading>
          </PermissionRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <PageLoading>
        <NotFound />
      </PageLoading>
    ),
  },
]);

export default router;