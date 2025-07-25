# React + Ant Design 项目模板

这是一个功能完整的 React + Ant Design 项目模板，包含了现代前端开发所需的各种功能和最佳实践。

## 功能特性

- ✅ **TypeScript + Vite** - 现代化的构建工具和类型支持
- ✅ **Ant Design** - 企业级 UI 组件库
- ✅ **React Router** - 声明式路由系统
- ✅ **Formik + Yup** - 强大的表单处理和验证
- ✅ **权限控制** - 动态菜单和按钮级权限控制
- ✅ **国际化 (i18next)** - 多语言支持
- ✅ **Axios 封装** - 请求拦截、响应处理、请求缓存
- ✅ **移动端适配** - 响应式布局和移动端优化
- ✅ **自定义 Hooks** - 可复用的逻辑组件
- ✅ **模块化架构** - 清晰的项目结构

## 技术栈

- **前端框架**: React 19
- **构建工具**: Vite 7
- **UI 组件库**: Ant Design 5
- **路由管理**: React Router 7
- **状态管理**: React Hooks
- **表单处理**: Formik + Yup
- **HTTP 请求**: Axios
- **国际化**: i18next
- **样式**: CSS + Ant Design
- **代码规范**: ESLint + TypeScript

## 项目结构

```
src/
├── components/          # 组件
│   ├── auth/           # 权限相关组件
│   ├── common/         # 通用组件
│   └── forms/          # 表单组件
├── hooks/              # 自定义 Hooks
├── i18n/               # 国际化配置
│   └── locales/        # 语言包
├── layouts/            # 布局组件
├── pages/              # 页面组件
├── router/             # 路由配置
├── services/           # API 服务
├── types/              # TypeScript 类型定义
├── utils/              # 工具函数
├── App.tsx             # 根组件
└── main.tsx            # 入口文件
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 功能说明

### 权限控制

项目提供了完整的权限控制解决方案：

#### 权限按钮组件
```tsx
import { PermissionButton } from '@/components';

<PermissionButton 
  permissions={['user:create']} 
  type="primary"
>
  创建用户
</PermissionButton>
```

#### 权限路由组件
```tsx
import { PermissionRoute } from '@/components';

<PermissionRoute permissions={['admin']}>
  <AdminPanel />
</PermissionRoute>
```

### 表单处理

使用 Formik + Yup 进行表单处理和验证：

```tsx
import { FormikForm } from '@/components';
import * as Yup from 'yup';

const fields = [
  {
    name: 'username',
    label: '用户名',
    type: 'text',
    required: true,
  },
  {
    name: 'email',
    label: '邮箱',
    type: 'email',
    required: true,
  },
];

const validationSchema = Yup.object({
  username: Yup.string().required('用户名不能为空'),
  email: Yup.string().email('邮箱格式不正确').required('邮箱不能为空'),
});

<FormikForm
  fields={fields}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
  initialValues={{ username: '', email: '' }}
/>
```

### API 请求

项目封装了 Axios，支持请求缓存：

```tsx
import httpClient from '@/services/request';

// 带缓存的 GET 请求
const response = await httpClient.get('/api/users', {
  cache: { ttl: 5 * 60 * 1000 } // 缓存 5 分钟
});

// POST 请求
const response = await httpClient.post('/api/users', userData);
```

### 国际化

支持中文和英文：

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

<Button>{t('common.save')}</Button>
```

### 自定义 Hooks

项目提供了多个实用的自定义 Hooks：

```tsx
import { useAuth, useDevice, usePermission } from '@/hooks';

// 认证状态
const { user, login, logout } = useAuth();

// 设备信息
const { isMobile, isTablet } = useDevice();

// 权限检查
const { checkPermission } = usePermission();
```

## 环境变量

复制 `.env.example` 为 `.env` 并配置相应的环境变量：

```bash
cp .env.example .env
```

主要环境变量：
- `VITE_API_BASE_URL`: API 基础地址
- `VITE_APP_TITLE`: 应用标题
- `VITE_APP_VERSION`: 应用版本

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 致谢

- [React](https://reactjs.org/)
- [Ant Design](https://ant.design/)
- [Vite](https://vitejs.dev/)
- [Formik](https://formik.org/)
- [i18next](https://www.i18next.com/)
