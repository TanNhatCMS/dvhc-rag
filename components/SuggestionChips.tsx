import React from 'react';
import { Tag, Flex, theme } from 'antd';

interface SuggestionChipsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ suggestions, onSuggestionClick }) => {
  const { token } = theme.useToken();

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <Flex gap="small" wrap>
      {suggestions.map((suggestion, index) => (
        <Tag
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          style={{ cursor: 'pointer', padding: '6px 10px', fontSize: '14px' }}
          color={token.colorPrimary}
        >
          {suggestion}
        </Tag>
      ))}
    </Flex>
  );
};

export default SuggestionChips;