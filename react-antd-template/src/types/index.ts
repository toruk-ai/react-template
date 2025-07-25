// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  roles: string[];
  permissions: string[];
}

// 菜单项类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  permissions?: string[];
  hidden?: boolean;
}

// 权限类型
export interface Permission {
  id: string;
  name: string;
  code: string;
  description?: string;
}

// API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应
export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 表单基础类型
export interface FormProps {
  onSubmit: (values: any) => void;
  loading?: boolean;
  initialValues?: any;
}

// 移动端检测类型
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
}

// 路由配置类型
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  permissions?: string[];
  meta?: {
    title: string;
    requireAuth?: boolean;
    hidden?: boolean;
  };
  children?: RouteConfig[];
}