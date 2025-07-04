import React from 'react';
import { Avatar, Flex, Typography } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { DisplayableApiHistoryItem } from '../types';
import { UserOutlined } from './icons';

interface ChatMessageProps {
  message: DisplayableApiHistoryItem;
}

const { Text } = Typography;

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';
  const textContent = message.parts.map(part => part.text).join('');

  const MarkdownContainer = (props: { children: React.ReactNode }) => (
    <div className="markdown-content" style={{ color: 'inherit' }}>
        {props.children}
    </div>
  );

  const content = (
    <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
            code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                    <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                ) : (
                    <code style={{ backgroundColor: 'rgba(128, 128, 128, 0.2)', padding: '2px 4px', borderRadius: '4px' }}>
                        {children}
                    </code>
                );
            },
        }}
    >
        {textContent}
    </ReactMarkdown>
  );

  const modelAvatar = (
     <Avatar 
        src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Bard_logo.svg" 
        alt="AI Avatar"
      />
  );
  
  const userAvatar = (
     <Avatar 
        style={{ backgroundColor: '#1677ff' }} 
        icon={<UserOutlined />} 
      />
  );

  const messageBubble = (
    <div style={{
      padding: '8px 12px',
      borderRadius: '12px',
      backgroundColor: isModel ? 'var(--ant-color-bg-elevated)' : 'var(--ant-primary-color)',
      color: isModel ? 'var(--ant-color-text)' : 'var(--ant-color-text-on-primary)',
      alignSelf: isModel ? 'flex-start' : 'flex-end',
      maxWidth: '100%',
    }}>
        <Text strong style={{ color: 'inherit', display: 'block', marginBottom: '4px' }}>
            {isModel ? 'Trợ lý AI' : 'Bạn'}
        </Text>
        <MarkdownContainer>{content}</MarkdownContainer>
    </div>
  );

  return (
    <Flex 
        gap={12} 
        align="flex-start" 
        justify={isModel ? 'flex-start' : 'flex-end'}
        style={{ width: '100%'}}
        className={`chat-message ${isModel ? 'model-message' : 'user-message'}`}
    >
        {isModel && modelAvatar}
        {messageBubble}
        {!isModel && userAvatar}
    </Flex>
  );
};

export default ChatMessage;