# 权限配置说明

## 默认用户信息

项目提供了一个默认的管理员用户，包含所有权限：

### 登录信息
- **用户名**: `admin`
- **密码**: `123456`

### 用户权限
```typescript
const mockUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  avatar: '',
  roles: ['admin'],
  permissions: [
    'user:read',     // 用户查看权限
    'user:create',   // 用户创建权限
    'user:update',   // 用户更新权限
    'user:delete',   // 用户删除权限
    'admin'          // 管理员权限
  ],
};
```

## 菜单权限配置

### 无权限要求的菜单
- **仪表盘** (`/dashboard`) - 所有登录用户可访问
- **布局测试** (`/test-layout`) - 所有登录用户可访问
- **个人中心** (`/profile`) - 所有登录用户可访问

### 需要特定权限的菜单
- **用户管理** (`/users`) - 需要 `user:read` 权限
- **系统设置** (`/settings`) - 需要 `admin` 权限

## 权限系统工作原理

### 1. 菜单级权限控制
菜单会根据用户权限自动过滤，用户只能看到有权限访问的菜单项。

```typescript
// 菜单配置示例
{
  key: 'user',
  label: '用户管理',
  icon: <TeamOutlined />,
  path: '/users',
  permissions: ['user:read'], // 需要此权限才显示菜单
}
```

### 2. 路由级权限控制
路由层面也有权限检查，确保即使直接访问 URL 也会进行权限验证。

```typescript
// 路由配置示例
{
  path: 'users',
  element: (
    <PermissionRoute permissions={['user:read']}>
      <UserManagement />
    </PermissionRoute>
  ),
}
```

### 3. 组件级权限控制
可以在任何组件中使用权限控制：

```typescript
// 权限按钮
<PermissionButton permissions={['user:create']}>
  创建用户
</PermissionButton>

// 权限检查 Hook
const { checkPermission } = usePermission();
if (checkPermission('user:delete')) {
  // 显示删除按钮
}
```

## 如何修改权限配置

### 1. 修改用户权限
编辑 `src/hooks/useAuth.ts` 文件中的 `mockUser` 对象：

```typescript
const mockUser: User = {
  // ... 其他属性
  permissions: [
    'custom:permission',  // 添加自定义权限
    // ... 其他权限
  ],
};
```

### 2. 添加新的权限菜单
在 `src/layouts/MainLayout.tsx` 中添加菜单项：

```typescript
{
  key: 'custom-page',
  label: '自定义页面',
  icon: <CustomIcon />,
  path: '/custom',
  permissions: ['custom:read'], // 设置所需权限
}
```

### 3. 添加权限路由
在 `src/router/index.tsx` 中添加路由：

```typescript
{
  path: 'custom',
  element: (
    <PermissionRoute permissions={['custom:read']}>
      <PageLoading>
        <CustomPage />
      </PageLoading>
    </PermissionRoute>
  ),
}
```

## 权限类型说明

### 资源权限
- `user:read` - 查看用户信息
- `user:create` - 创建用户
- `user:update` - 更新用户信息
- `user:delete` - 删除用户

### 角色权限
- `admin` - 管理员角色，通常拥有所有权限
- `editor` - 编辑者角色
- `viewer` - 查看者角色

### 功能权限
- `export:data` - 导出数据权限
- `import:data` - 导入数据权限
- `backup:system` - 系统备份权限

## 权限验证流程

1. **登录验证** - 用户登录后获取用户信息和权限列表
2. **菜单过滤** - 根据用户权限过滤显示的菜单项
3. **路由守卫** - 访问页面时检查路由权限
4. **组件权限** - 在组件内部检查操作权限

## 开发建议

### 1. 权限命名规范
建议使用 `资源:操作` 的格式，如：
- `user:read` - 用户查看
- `order:create` - 订单创建
- `report:export` - 报表导出

### 2. 权限粒度
- **页面级权限** - 控制整个页面的访问
- **功能级权限** - 控制页面内特定功能
- **数据级权限** - 控制数据的访问范围

### 3. 权限继承
管理员角色通常包含所有权限，其他角色包含特定权限子集。

## 注意事项

1. **前端权限验证** 主要用于用户体验优化，真正的安全验证应该在后端进行
2. **权限缓存** 用户权限信息会缓存在本地存储中，注意及时更新
3. **权限变更** 如果用户权限在后端发生变化，需要重新登录或调用刷新接口