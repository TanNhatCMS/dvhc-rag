
import React from 'react';
import { Layout, Menu, Button, Popconfirm, Flex, Typography, theme } from 'antd';
import { ChatSession } from '../types';
import { DeleteOutlined, SettingOutlined } from './icons';
import PlusIcon from './PlusIcon';

const { Sider } = Layout;
const { Text } = Typography;

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSwitchChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onDeleteAll: () => void;
  onSettingsClick: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onNewChat,
  onSwitchChat,
  onDeleteChat,
  onDeleteAll,
  onSettingsClick
}) => {
    const { token } = theme.useToken();

    const menuItems = sessions.map(session => ({
        key: session.id,
        label: (
            <Flex align="center" justify="space-between">
                <Text style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'inherit' }}>
                    {session.title}
                </Text>
                <Popconfirm
                    title="Xóa cuộc trò chuyện?"
                    description="Bạn có chắc muốn xóa?"
                    onConfirm={(e) => {
                        e?.stopPropagation();
                        onDeleteChat(session.id);
                    }}
                    onCancel={(e) => e?.stopPropagation()}
                    okText="Xóa"
                    cancelText="Hủy"
                    icon={null}
                >
                    <Button 
                        icon={<DeleteOutlined />} 
                        type="text" 
                        danger 
                        size="small"
                        onClick={e => e.stopPropagation()}
                        className="chat-delete-button"
                    />
                </Popconfirm>
            </Flex>
        ),
    }));

  return (
    <Sider
      collapsible
      collapsed={!isOpen}
      onCollapse={(collapsed) => { if (collapsed) onClose() }}
      trigger={null}
      breakpoint="lg"
      collapsedWidth="0"
      width={280}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: token.colorBgContainer,
        borderRight: `1px solid ${token.colorBorderSecondary}`
      }}
      className="chat-sidebar"
    >
        <div style={{ padding: '16px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
            <Button
                type="primary"
                block
                icon={<PlusIcon />}
                onClick={onNewChat}
            >
                Cuộc trò chuyện mới
            </Button>
        </div>
        <Menu
            mode="inline"
            selectedKeys={currentSessionId ? [currentSessionId] : []}
            items={menuItems}
            onClick={({ key }) => onSwitchChat(key)}
            style={{ flex: 1, overflowY: 'auto', borderRight: 0, backgroundColor: 'transparent' }}
        />
         <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}`, padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button
                icon={<SettingOutlined />}
                block
                type="text"
                style={{ textAlign: 'left' }}
                onClick={onSettingsClick}
            >
                Cài đặt
            </Button>
            <Popconfirm
                title="Xóa tất cả?"
                description="Hành động này không thể hoàn tác."
                onConfirm={onDeleteAll}
                okText="Xóa"
                cancelText="Hủy"
                icon={null}
            >
                <Button
                    icon={<DeleteOutlined />}
                    block
                    danger
                    type="text"
                    style={{ textAlign: 'left' }}
                >
                    Xóa tất cả
                </Button>
            </Popconfirm>
        </div>
    </Sider>
  );
};

export default ChatSidebar;