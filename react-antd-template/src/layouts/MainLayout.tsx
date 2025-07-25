import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Breadcrumb,
  Avatar,
  Dropdown,
  Space,
  Button,
  theme,
  type MenuProps,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, useDevice } from '../hooks';
import type { MenuItem } from '../types';
import LanguageSelector from '../components/common/LanguageSelector';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { isMobile, isTablet } = useDevice();

  // 移动端和小平板自动收起侧边栏，桌面端默认展开
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else if (isTablet) {
      setCollapsed(true); // 平板也收起，节省空间
    } else {
      setCollapsed(false); // 桌面端默认展开
    }
  }, [isMobile, isTablet]);

  // 模拟菜单数据
  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      label: t('menu.dashboard'),
      icon: <DashboardOutlined />,
      path: '/dashboard',
    },
    {
      key: 'test-layout',
      label: '布局测试',
      icon: <SettingOutlined />,
      path: '/test-layout',
    },
    {
      key: 'user',
      label: t('menu.user'),
      icon: <TeamOutlined />,
      path: '/users',
      permissions: ['user:read'],
    },
  ];

  // 过滤有权限的菜单项
  const filterMenusByPermission = (items: MenuItem[]): MenuItem[] => {
    return items.filter((item) => {
      // 如果菜单项没有权限要求，直接显示
      if (!item.permissions || item.permissions.length === 0) {
        return true;
      }
      
      // 检查用户是否有所需权限
      if (!user) return false;
      
      return item.permissions.some(permission => 
        user.permissions.includes(permission)
      );
    }).map((item) => ({
      ...item,
      children: item.children ? filterMenusByPermission(item.children) : undefined,
    }));
  };

  // 转换为 Ant Design Menu 所需的格式
  const getMenuItems = (items: MenuItem[]): MenuProps['items'] => {
    const filteredItems = filterMenusByPermission(items);
    return filteredItems.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children ? getMenuItems(item.children) : undefined,
    }));
  };

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    const menuItem = findMenuItem(menuItems, key);
    if (menuItem?.path) {
      navigate(menuItem.path);
    }
  };

  // 查找菜单项
  const findMenuItem = (items: MenuItem[], key: string): MenuItem | null => {
    for (const item of items) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findMenuItem(item.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  // 生成面包屑
  const generateBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [
      {
        title: t('page.home'),
        onClick: () => navigate('/'),
      },
    ];

    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const menuItem = findMenuItem(menuItems, segment);
      breadcrumbItems.push({
        title: menuItem?.label || segment,
        onClick: () => navigate(path),
      });
    });

    return breadcrumbItems;
  };

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('menu.profile'),
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('menu.system'),
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('menu.logout'),
      onClick: logout,
    },
  ];

  const selectedKeys = [location.pathname.split('/')[1] || 'dashboard'];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="md"
        onBreakpoint={(broken) => {
          // 只在移动端断点时自动收起，避免在桌面端误触发
          if (broken && window.innerWidth <= 576) {
            setCollapsed(true);
          }
        }}
        style={{
          background: token.colorBgContainer,
        }}
        width={220} // 设置固定宽度，避免内容遮挡
      >
        <div
          style={{
            height: 64,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: collapsed ? 16 : 20,
            fontWeight: 'bold',
            color: token.colorPrimary,
          }}
        >
          {collapsed ? 'R' : 'React Template'}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKeys}
          items={getMenuItems(menuItems)}
          onClick={handleMenuClick}
        />
      </Sider>
      
      <Layout>
        <Header
          style={{
            padding: 0,
            background: token.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 24,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          <Space>
            <LanguageSelector />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={user?.avatar}
                />
                <span>{user?.username}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content
          style={{
            margin: isMobile ? '16px 8px' : '24px 16px',
            padding: isMobile ? 16 : 24,
            minHeight: 'calc(100vh - 112px)', // 确保内容区域高度合适
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            overflow: 'auto', // 允许内容滚动
          }}
        >
          <Breadcrumb
            style={{ marginBottom: 16 }}
            items={generateBreadcrumb()}
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;