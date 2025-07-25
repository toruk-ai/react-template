import React from 'react';
import { Spin, type SpinProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps extends SpinProps {
  spinning?: boolean;
  tip?: string;
  children?: React.ReactNode;
}

const Loading: React.FC<LoadingProps> = ({
  spinning = true,
  tip = '加载中...',
  children,
  ...spinProps
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  if (!children) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
        }}
      >
        <Spin indicator={antIcon} tip={tip} spinning={spinning} {...spinProps} />
      </div>
    );
  }

  return (
    <Spin indicator={antIcon} tip={tip} spinning={spinning} {...spinProps}>
      {children}
    </Spin>
  );
};

export default Loading;