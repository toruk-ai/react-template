import React from 'react';
import { Button, type ButtonProps } from 'antd';
import { usePermission } from '../../hooks';

interface PermissionButtonProps extends ButtonProps {
  permissions?: string | string[];
  roles?: string | string[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // 是否需要所有权限都满足
}

const PermissionButton: React.FC<PermissionButtonProps> = ({
  permissions,
  roles,
  fallback = null,
  requireAll = false,
  children,
  ...buttonProps
}) => {
  const { checkPermission, checkRole } = usePermission();

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

  // 判断是否有权限显示按钮
  const hasAccess = hasRequiredPermissions() && hasRequiredRoles();

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <Button {...buttonProps}>{children}</Button>;
};

export default PermissionButton;