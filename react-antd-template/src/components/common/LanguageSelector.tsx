import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, getSupportedLanguages } from '../../i18n';

const { Option } = Select;

interface LanguageSelectorProps {
  className?: string;
  style?: React.CSSProperties;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className, style }) => {
  const { t } = useTranslation();
  const currentLanguage = getCurrentLanguage();
  const supportedLanguages = getSupportedLanguages();

  const handleChange = (language: string) => {
    changeLanguage(language);
  };

  return (
    <Select
      className={className}
      style={{ minWidth: 120, ...style }}
      value={currentLanguage}
      onChange={handleChange}
      placeholder={t('setting.language')}
    >
      {supportedLanguages.map((lang) => (
        <Option key={lang.key} value={lang.key}>
          <span style={{ marginRight: 8 }}>{lang.icon}</span>
          {lang.label}
        </Option>
      ))}
    </Select>
  );
};

export default LanguageSelector;