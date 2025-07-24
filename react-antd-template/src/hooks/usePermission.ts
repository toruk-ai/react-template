import { useMemo } from 'react';
import { hasPermission } from '../utils';
import useAuth from './useAuth';

const usePermission = () => {
  const { user } = useAuth();

  const userPermissions = useMemo(() => {
    return user?.permissions || [];
  }, [user?.permissions]);

  const checkPermission = useMemo(() => {
    return (requiredPermissions: string | string[]) => {
      if (!user) return false;
      
      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];
      
      return hasPermission(userPermissions, permissions);
    };
  }, [user, userPermissions]);

  const checkRole = useMemo(() => {
    return (requiredRoles: string | string[]) => {
      if (!user) return false;
      
      const roles = Array.isArray(requiredRoles) 
        ? requiredRoles 
        : [requiredRoles];
      
      return roles.some(role => user.roles.includes(role));
    };
  }, [user]);

  return {
    permissions: userPermissions,
    roles: user?.roles || [],
    checkPermission,
    checkRole,
    hasPermission: checkPermission,
    hasRole: checkRole,
  };
};

export default usePermission;