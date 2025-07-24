import React from 'react';
import { Navigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { usePermission, useAuth } from '../../hooks';

interface PermissionRouteProps {
  children: React.ReactNode;
  permissions?: string | string[];
  roles?: string | string[];
  requireAll?: boolean;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

const PermissionRoute: React.FC<PermissionRouteProps> = ({
  children,
  permissions,
  roles,
  requireAll = false,
  requireAuth = true,
  fallback,
}) => {
  const { isAuthenticated, loading } = useAuth();
  const { checkPermission, checkRole } = usePermission();

  // 加载中状态
  if (loading) {
    return <div>Loading...</div>;
  }

  // 需要认证但未登录
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 检查权限
  const hasRequiredPermissions = () => {
    if (!permissions) return true;
    
    const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
    
    if (requireAll) {
      return permissionArray.every(permission => checkPermission(permission));
    } else {
      return permissionArray.some(permission => checkPermission(permission));
    }
  };

  // 检查角色
  const hasRequiredRoles = () => {
    if (!roles) return true;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    
    if (requireAll) {
      return roleArray.every(role => checkRole(role));
    } else {
      return roleArray.some(role => checkRole(role));
    }
  };

  // 判断是否有权限访问
  const hasAccess = hasRequiredPermissions() && hasRequiredRoles();

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面。"
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            返回
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
};

export default PermissionRoute;