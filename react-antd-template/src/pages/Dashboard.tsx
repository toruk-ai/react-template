import React from 'react';
import { Row, Col, Card, Statistic, Progress, List, Typography, Space } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../hooks';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { isMobile } = useDevice();

  // 模拟数据
  const statisticsData = [
    {
      title: '总用户数',
      value: 2680,
      prefix: <UserOutlined />,
      suffix: '人',
      valueStyle: { color: '#3f8600' },
      precision: 0,
    },
    {
      title: '订单数量',
      value: 1234,
      prefix: <ShoppingCartOutlined />,
      suffix: '笔',
      valueStyle: { color: '#cf1322' },
      precision: 0,
    },
    {
      title: '销售额',
      value: 98765,
      prefix: <DollarOutlined />,
      suffix: '元',
      valueStyle: { color: '#1890ff' },
      precision: 2,
    },
    {
      title: '增长率',
      value: 85.2,
      prefix: <RiseOutlined />,
      suffix: '%',
      valueStyle: { color: '#722ed1' },
      precision: 1,
    },
  ];

  const recentActivities = [
    { title: '用户 张三 注册了账号', time: '2分钟前' },
    { title: '订单 #12345 已完成支付', time: '5分钟前' },
    { title: '产品 MacBook Pro 库存不足', time: '10分钟前' },
    { title: '用户 李四 提交了反馈', time: '15分钟前' },
    { title: '系统完成了数据备份', time: '30分钟前' },
  ];

  const projectProgress = [
    { name: '项目 A', progress: 85, status: 'active' },
    { name: '项目 B', progress: 65, status: 'normal' },
    { name: '项目 C', progress: 45, status: 'exception' },
    { name: '项目 D', progress: 95, status: 'success' },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        {t('menu.dashboard')}
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statisticsData.map((item, index) => (
          <Col
            key={index}
            xs={24}
            sm={12}
            lg={6}
          >
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                precision={item.precision}
                valueStyle={item.valueStyle}
                prefix={item.prefix}
                suffix={item.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 内容区域 */}
      <Row gutter={[16, 16]}>
        {/* 最近活动 */}
        <Col xs={24} lg={12}>
          <Card
            title="最近活动"
            style={{ height: 400 }}
            bodyStyle={{ 
              height: 'calc(100% - 57px)', 
              overflow: 'auto' 
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <Text type="secondary">{item.time}</Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 项目进度 */}
        <Col xs={24} lg={12}>
          <Card
            title="项目进度"
            style={{ height: 400 }}
            bodyStyle={{ 
              height: 'calc(100% - 57px)', 
              overflow: 'auto' 
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {projectProgress.map((project, index) => (
                <div key={index}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: 8 
                  }}>
                    <Text>{project.name}</Text>
                    <Text>{project.progress}%</Text>
                  </div>
                  <Progress
                    percent={project.progress}
                    status={project.status as any}
                    showInfo={false}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 移动端额外的图表区域 */}
      {isMobile && (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="数据趋势">
              <div style={{ 
                height: 200, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: '#f5f5f5',
                borderRadius: 6,
              }}>
                <Text type="secondary">图表区域（可集成 ECharts 等图表库）</Text>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;