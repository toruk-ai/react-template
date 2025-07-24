# 使用指南

## 项目启动

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

项目将在 http://localhost:3000 启动。

### 3. 登录测试
- 用户名: `admin`
- 密码: `123456`

## 功能演示

### 权限控制

项目包含完整的权限控制系统：

1. **路由权限**: 根据用户权限动态显示路由
2. **菜单权限**: 根据权限控制菜单显示
3. **按钮权限**: 细粒度的按钮级别权限控制

```tsx
// 使用权限按钮
<PermissionButton 
  permissions={['user:create']} 
  type="primary"
>
  创建用户
</PermissionButton>

// 使用权限路由
<PermissionRoute permissions={['admin']}>
  <AdminPanel />
</PermissionRoute>
```

### 表单处理

使用 Formik + Yup 进行表单处理：

```tsx
import { FormikForm } from '@/components';
import * as Yup from 'yup';

const UserForm = () => {
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
    {
      name: 'role',
      label: '角色',
      type: 'select',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '用户', value: 'user' },
      ],
    },
  ];

  const validationSchema = Yup.object({
    username: Yup.string().required('用户名不能为空'),
    email: Yup.string().email('邮箱格式不正确').required('邮箱不能为空'),
    role: Yup.string().required('请选择角色'),
  });

  const handleSubmit = (values) => {
    console.log('Form values:', values);
  };

  return (
    <FormikForm
      fields={fields}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      initialValues={{ username: '', email: '', role: '' }}
    />
  );
};
```

### API 请求

项目封装了 Axios，支持请求缓存：

```tsx
import httpClient from '@/services/request';

// 带缓存的 GET 请求
const getUserList = async () => {
  const response = await httpClient.get('/api/users', {
    cache: { 
      ttl: 5 * 60 * 1000, // 缓存 5 分钟
      key: 'user-list' // 自定义缓存键
    }
  });
  return response.data;
};

// POST 请求
const createUser = async (userData) => {
  const response = await httpClient.post('/api/users', userData);
  return response.data;
};

// 清除缓存
httpClient.clearCache('user-list'); // 清除指定缓存
httpClient.clearCache(); // 清除所有缓存
```

### 国际化

支持中英文切换：

```tsx
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/i18n';

const MyComponent = () => {
  const { t } = useTranslation();

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  return (
    <div>
      <h1>{t('menu.dashboard')}</h1>
      <Button onClick={() => handleLanguageChange('en-US')}>
        English
      </Button>
      <Button onClick={() => handleLanguageChange('zh-CN')}>
        中文
      </Button>
    </div>
  );
};
```

### 自定义 Hooks

项目提供了多个实用的自定义 Hooks：

```tsx
import { 
  useAuth, 
  useDevice, 
  usePermission, 
  useLocalStorage,
  useDebounce,
  useThrottle 
} from '@/hooks';

const MyComponent = () => {
  // 认证状态
  const { user, login, logout, isAuthenticated } = useAuth();

  // 设备信息
  const { isMobile, isTablet, isDesktop } = useDevice();

  // 权限检查
  const { checkPermission, checkRole } = usePermission();

  // 本地存储
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  // 防抖
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 节流
  const throttledSave = useThrottle((data) => {
    console.log('Saving:', data);
  }, 1000);

  return (
    <div>
      {/* 使用这些 hooks 的组件逻辑 */}
    </div>
  );
};
```

### 移动端适配

项目包含移动端适配基础结构：

```tsx
import { useDevice } from '@/hooks';

const ResponsiveComponent = () => {
  const { isMobile, isTablet, screenWidth } = useDevice();

  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : isTablet ? (
        <TabletLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
};
```

## 项目结构说明

```
src/
├── components/          # 可复用组件
│   ├── auth/           # 权限相关组件
│   │   ├── PermissionButton.tsx    # 权限按钮
│   │   └── PermissionRoute.tsx     # 权限路由
│   ├── common/         # 通用组件
│   │   ├── Loading.tsx             # 加载组件
│   │   └── LanguageSelector.tsx    # 语言选择器
│   └── forms/          # 表单组件
│       └── FormikForm.tsx          # Formik 表单组件
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

## 开发建议

### 1. 添加新页面
1. 在 `src/pages/` 下创建新的页面组件
2. 在 `src/router/index.tsx` 中添加路由配置
3. 如需权限控制，使用 `PermissionRoute` 包装

### 2. 添加新 API
1. 在 `src/services/api.ts` 中添加新的 API 接口
2. 使用 `httpClient` 进行请求，支持缓存配置

### 3. 添加新组件
1. 在 `src/components/` 相应目录下创建组件
2. 在 `src/components/index.ts` 中导出
3. 使用 TypeScript 定义 Props 类型

### 4. 添加新语言
1. 在 `src/i18n/locales/` 下添加新的语言包
2. 在 `src/i18n/index.ts` 中注册新语言
3. 更新 `getSupportedLanguages` 函数

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 修复代码问题
npm run lint:fix

# 预览构建结果
npm run preview

# 清理项目
npm run clean

# 分析打包大小
npm run analyze
```

## 部署

### 1. 构建生产版本
```bash
npm run build
```

### 2. 部署到服务器
将 `dist` 目录的内容上传到服务器的网站根目录。

### 3. 配置 Nginx（示例）
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-api-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 注意事项

1. **Mock 数据**: 当前项目使用模拟数据，在实际项目中需要替换为真实的 API 接口
2. **权限配置**: 权限数据来自模拟用户，需要根据实际后端接口调整
3. **环境变量**: 在 `.env` 文件中配置实际的 API 地址和其他环境变量
4. **路径别名**: 项目配置了 `@` 别名指向 `src` 目录，可以直接使用 `@/components` 导入组件

## 扩展功能

项目预留了扩展接口，可以轻松添加：

1. **状态管理**: 可以集成 Redux、Zustand 等状态管理库
2. **图表库**: 可以集成 ECharts、Chart.js 等图表库
3. **React Query**: 可以替换或配合当前的请求缓存机制
4. **主题切换**: 基于 Ant Design 的主题配置
5. **PWA**: 可以配置为渐进式 Web 应用
6. **单元测试**: 可以添加 Jest、Testing Library 等测试框架