import React from 'react';
import { Card, Row, Col, Typography, Alert, Space } from 'antd';
import { useDevice } from '../hooks';

const { Title, Text } = Typography;

const TestLayout: React.FC = () => {
  const { isMobile, isTablet, screenWidth, screenHeight } = useDevice();

  return (
    <div>
      <Title level={2}>布局测试页面</Title>
      
      <Alert
        message="设备信息检测"
        description={
          <Space direction="vertical">
            <Text>屏幕尺寸: {screenWidth} x {screenHeight}</Text>
            <Text>设备类型: {isMobile ? '移动设备' : isTablet ? '平板设备' : '桌面设备'}</Text>
            <Text>断点说明: 移动端 ≤576px, 平板 577-992px, 桌面 &gt;992px</Text>
          </Space>
        }
        type="info"
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card title="卡片 1">
            <p>这是第一个测试卡片，用于验证响应式布局。</p>
            <p>在不同屏幕尺寸下，卡片的排列会自动调整。</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card title="卡片 2">
            <p>这是第二个测试卡片。</p>
            <p>侧边栏应该在桌面端默认展开，在移动端收起。</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card title="卡片 3">
            <p>这是第三个测试卡片。</p>
            <p>内容区域应该不会被侧边栏遮挡。</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card title="卡片 4">
            <p>这是第四个测试卡片。</p>
            <p>页面应该能够正常滚动，不会出现布局问题。</p>
          </Card>
        </Col>
      </Row>

      <Card title="长内容测试" style={{ marginTop: 24 }}>
        <div style={{ height: 600, overflow: 'auto', border: '1px solid #f0f0f0', padding: 16 }}>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} style={{ marginBottom: 16 }}>
              这是第 {i + 1} 段测试内容。这些内容用于测试页面滚动和布局是否正常。
              在桌面端，侧边栏应该默认展开，内容区域不应该被遮挡。
              在移动端，侧边栏应该收起，为内容留出更多空间。
              页面应该响应式适配不同的屏幕尺寸。
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TestLayout;