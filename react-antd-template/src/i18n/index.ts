import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { storage } from '../utils';

// 导入语言包
import enUS from './locales/en-US.json';
import zhCN from './locales/zh-CN.json';

// 语言资源
const resources = {
  'en-US': {
    translation: enUS,
  },
  'zh-CN': {
    translation: zhCN,
  },
};

// 获取默认语言
const getDefaultLanguage = (): string => {
  // 优先从本地存储获取
  const savedLanguage = storage.get('language');
  if (savedLanguage && resources[savedLanguage as keyof typeof resources]) {
    return savedLanguage;
  }

  // 从浏览器语言获取
  const browserLanguage = navigator.language;
  if (resources[browserLanguage as keyof typeof resources]) {
    return browserLanguage;
  }

  // 默认使用中文
  return 'zh-CN';
};

// 初始化 i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDefaultLanguage(),
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false,
    },
    // 启用命名空间
    ns: ['translation'],
    defaultNS: 'translation',
    // 调试模式
    debug: import.meta.env.DEV,
  });

// 语言切换函数
export const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);
  storage.set('language', language);
};

// 获取当前语言
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

// 获取支持的语言列表
export const getSupportedLanguages = () => {
  return [
    { key: 'zh-CN', label: '中文', icon: '🇨🇳' },
    { key: 'en-US', label: 'English', icon: '🇺🇸' },
  ];
};

export default i18n;