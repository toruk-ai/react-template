import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import router from './router';
import './i18n'; // 导入 i18n 配置

const App: React.FC = () => {
  const { i18n } = useTranslation();

  // 根据当前语言设置 Ant Design 的本地化
  const getAntdLocale = () => {
    switch (i18n.language) {
      case 'en-US':
        return enUS;
      case 'zh-CN':
      default:
        return zhCN;
    }
  };

  return (
    <ConfigProvider
      locale={getAntdLocale()}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
