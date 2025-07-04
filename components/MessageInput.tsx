

import React, { useState } from 'react';
import { Input, Button, Flex } from 'antd';
import SendIcon from './SendIcon';
import HamburgerIcon from './HamburgerIcon';
import LoadingIcon from './LoadingIcon';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isGeneratingTitle: boolean;
  onMenuClick: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  isGeneratingTitle,
  onMenuClick,
}) => {
  const [userInput, setUserInput] = useState('');
  const isDisabled = isLoading || isGeneratingTitle;

  const handleSend = () => {
    if (!userInput.trim() || isDisabled) return;
    onSendMessage(userInput);
    setUserInput('');
  };

  return (
    <div style={{ padding: '16px 24px', borderTop: '1px solid var(--ant-border-color-secondary)' }}>
      <Flex gap="middle" align="center">
        <Button 
          icon={<HamburgerIcon />} 
          onClick={onMenuClick} 
          aria-label="Mở menu"
        />
        <Input.Group compact style={{ display: 'flex', flex: 1 }}>
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isGeneratingTitle ? "AI đang tạo tiêu đề..." : "Nhập câu hỏi của bạn..."}
            disabled={isDisabled}
            size="large"
            onPressEnter={handleSend}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={isLoading ? <LoadingIcon /> : <SendIcon />}
            size="large"
            onClick={handleSend}
            disabled={isDisabled || !userInput.trim()}
          />
        </Input.Group>
      </Flex>
    </div>
  );
};

export default ChatInput;
