
import React from 'react';
import { List, Spin, Flex, Avatar } from 'antd';
import { DisplayableApiHistoryItem } from '../types';
import ChatMessage from './Message';
import SuggestionChips from './SuggestionChips';
import LoadingIcon from './LoadingIcon';

interface ChatMessageListProps {
  history: DisplayableApiHistoryItem[];
  suggestions: string[];
  isLoading: boolean;
  isRagLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onSuggestionClick: (suggestion: string) => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  history,
  suggestions,
  isLoading,
  isRagLoading,
  messagesEndRef,
  onSuggestionClick
}) => {
  const displayableHistory = history.filter(item => 
    (item.role === 'user' || item.role === 'model') && item.parts.some(p => typeof p.text === 'string' && p.text.trim() !== '')
  );

  if (isRagLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin indicator={<LoadingIcon style={{ fontSize: 24 }} />} tip="Đang tải cơ sở tri thức..." />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
      <List
        dataSource={displayableHistory}
        renderItem={(item) => (
          <List.Item style={{ border: 'none', padding: '0', marginBottom: '12px' }}>
            <ChatMessage message={item} />
          </List.Item>
        )}
      />
      {isLoading && (
         <List.Item style={{ border: 'none', padding: '0', marginBottom: '12px' }}>
            <Flex gap={12} align="center" justify="flex-start">
              <Avatar src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Bard_logo.svg" alt="AI Avatar" />
              <div style={{
                padding: '10px 12px',
                borderRadius: '12px',
                backgroundColor: 'var(--ant-color-bg-elevated)',
              }}>
                <Spin indicator={<LoadingIcon style={{ fontSize: 16, color: 'var(--ant-primary-color)'}} />} />
              </div>
            </Flex>
         </List.Item>
      )}
      {!isLoading && suggestions.length > 0 && (
         <div style={{ paddingTop: '16px' }}>
            <SuggestionChips suggestions={suggestions} onSuggestionClick={onSuggestionClick} />
         </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
