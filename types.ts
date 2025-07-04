import type { Content } from '@google/genai';

// Re-export Content for use in App.tsx
export type ApiHistoryItem = Content;

export type DisplayableApiHistoryItem = ApiHistoryItem & {
  id: string; // Unique ID for React keys
};

// Session Management
export interface ChatSession {
  id: string;
  title: string;
  history: DisplayableApiHistoryItem[];
  suggestions: string[];
}

// Settings Types
export type Theme = 'light' | 'dark' | 'system';
export type ChatMode = 'professional' | 'creative' | 'technical';
export type AiModel = 'gemini-2.5-flash-preview-04-17' | 'gemini-pro-vision'; // Add more models here
export type ResponseMode = 'standard' | 'stream';

export interface AppSettings {
  theme: Theme;
  chatMode: ChatMode;
  aiModel: AiModel;
  responseMode: ResponseMode;
}
