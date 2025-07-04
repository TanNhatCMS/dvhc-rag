import React from 'react';
import { Layout, Typography } from 'antd';

const { Header } = Layout;
const { Title, Text } = Typography;

const ChatHeader: React.FC = () => (
  <Header style={{ 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 20px', 
    borderBottom: '1px solid var(--ant-border-color-secondary)',
    height: 64,
    backgroundColor: 'var(--ant-color-bg-container)'
  }}>
    <Title level={4} style={{ margin: 0, lineHeight: '1.2', color: 'var(--ant-color-text)' }}>Trợ lý ảo ĐVHC Tây Ninh</Title>
    <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.2' }}>TanNhatCMS AI Phát triển bởi MrKiệt</Text>
  </Header>
);

export default ChatHeader;