import React from 'react';
import { Card, Form, Input, Button, Checkbox, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, useDevice } from '../hooks';
import LanguageSelector from '../components/common/LanguageSelector';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { login, isAuthenticated, loading } = useAuth();
  const { isMobile } = useDevice();

  // 已登录则跳转到首页
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (values: { username: string; password: string; remember: boolean }) => {
    try {
      const result = await login({
        username: values.username,
        password: values.password,
      });

      if (result.success) {
        message.success(t('auth.loginSuccess'));
      } else {
        message.error(result.error || t('auth.loginFailed'));
      }
    } catch (error) {
      message.error(t('auth.loginFailed'));
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? 16 : 24,
      }}
    >
      <Card
        style={{
          width: isMobile ? '100%' : 400,
          maxWidth: 400,
        }}
        bodyStyle={{ padding: isMobile ? 16 : 24 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>React Template</h1>
          <p style={{ color: '#666', marginBottom: 0 }}>{t('auth.login')}</p>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: t('auth.usernameRequired'),
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t('auth.username')}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: t('auth.passwordRequired'),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('auth.password')}
            />
          </Form.Item>

          <Form.Item>
            <Row justify="space-between" align="middle">
              <Col>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>{t('auth.rememberMe')}</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <a href="#forgot">{t('auth.forgotPassword')}</a>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
            >
              {t('auth.login')}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <LanguageSelector />
        </div>

        {/* 示例账号提示 */}
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: '#f0f0f0',
            borderRadius: 4,
            fontSize: 12,
            color: '#666',
          }}
        >
          <div>Demo Account:</div>
          <div>Username: admin</div>
          <div>Password: 123456</div>
        </div>
      </Card>
    </div>
  );
};

export default Login;