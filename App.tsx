

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Layout, ConfigProvider, theme as antdTheme, App as AntApp } from 'antd';
import { AppSettings, ChatSession, DisplayableApiHistoryItem } from './types';
import { sendMessageToAI, sendMessageToAIStream, generateChatTitle } from './services/geminiService';
import ChatHeader from './components/Header';
import ChatMessageList from './components/ChatMessageList';
import ChatInput from './components/MessageInput';
import SettingsModal from './components/SettingsModal';
import ChatSidebar from './components/Sidebar';

const { Content } = Layout;

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState<boolean>(false);
  const [ragContent, setRagContent] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const storedSettings = localStorage.getItem('appSettings');
      return storedSettings ? JSON.parse(storedSettings) : {
        theme: 'system',
        chatMode: 'professional',
        aiModel: 'gemini-2.5-flash-preview-04-17',
        responseMode: 'standard'
      };
    } catch (error) {
      return { theme: 'system', chatMode: 'professional', aiModel: 'gemini-2.5-flash-preview-04-17', responseMode: 'standard' };
    }
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initializeNewSession = (): ChatSession => {
    const newId = Date.now().toString();
    return {
      id: newId,
      title: 'Cuộc trò chuyện mới',
      history: [{
        id: 'initial-' + newId,
        role: 'model',
        parts: [{ text: 'Xin chào! Tôi là Trợ lý ảo, đã sẵn sàng trả lời các câu hỏi về đơn vị hành chính tỉnh Tây Ninh. Mời bạn đặt câu hỏi.' }],
      }],
      suggestions: ["Tỉnh Tây Ninh có bao nhiêu huyện, thị xã?", "Địa chỉ mới của xã Thạnh Hưng là gì?", "Thủ tục đăng ký xe máy cần những gì?"]
    };
  };

  useEffect(() => {
    const fetchRagContent = async () => {
      try {
        const response = await fetch('/rag_data.md');
        const text = await response.text();
        setRagContent(text);

        const storedSessions = localStorage.getItem('chatSessions');
        const storedSessionId = localStorage.getItem('currentSessionId');
        
        let loadedSessions: ChatSession[] = [];
        if (storedSessions) {
            try {
                loadedSessions = JSON.parse(storedSessions);
            } catch {
                loadedSessions = [];
            }
        }

        if (loadedSessions.length > 0) {
            setSessions(loadedSessions);
            const sessionExists = loadedSessions.some(s => s.id === storedSessionId);
            setCurrentSessionId(sessionExists ? storedSessionId : loadedSessions[0].id);
        } else {
            const newSession = initializeNewSession();
            setSessions([newSession]);
            setCurrentSessionId(newSession.id);
        }

      } catch (error) {
        console.error("Failed to fetch RAG or initialize session:", error);
        const newSession = initializeNewSession();
        setSessions([newSession]);
        setCurrentSessionId(newSession.id);
      }
    };
    fetchRagContent();
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
    if (currentSessionId) {
      localStorage.setItem('currentSessionId', currentSessionId);
    }
  }, [sessions, currentSessionId]);
  
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    const applyTheme = () => {
      if (settings.theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setEffectiveTheme(systemTheme);
      } else {
        setEffectiveTheme(settings.theme);
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);

  }, [settings]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [sessions, currentSessionId, isLoading]);

  const handleNewChat = () => {
    const newSession = initializeNewSession();
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setIsSidebarOpen(false);
  };

  const handleSwitchChat = (id: string) => {
    setCurrentSessionId(id);
    setIsSidebarOpen(false);
  };

  const handleDeleteChat = useCallback((idToDelete: string) => {
    setSessions(prev => {
        const remaining = prev.filter(s => s.id !== idToDelete);
        
        // If no sessions left after deletion, create a new one
        if (remaining.length === 0) {
            const newSession = initializeNewSession();
            setCurrentSessionId(newSession.id);
            return [newSession];
        }

        // If the deleted session was the current one, switch to the first available session
        if (currentSessionId === idToDelete) {
            setCurrentSessionId(remaining[0].id);
        }
        
        return remaining;
    });
  }, [currentSessionId]);


  const handleDeleteAll = () => {
     if(window.confirm("Bạn có chắc chắn muốn xóa tất cả các cuộc trò chuyện không?")) {
        const newSession = initializeNewSession();
        setSessions([newSession]);
        setCurrentSessionId(newSession.id);
        setIsSidebarOpen(false);
     }
  }
  
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
  };

  const updateSessionHistory = (sessionId: string, updater: (prevHistory: DisplayableApiHistoryItem[]) => DisplayableApiHistoryItem[], newSuggestions: string[] = []) => {
      setSessions(prev => prev.map(s => {
          if (s.id === sessionId) {
              const newHistory = updater(s.history);
              // Only update suggestions if a new list is provided and not empty
              const updatedSuggestions = newSuggestions.length > 0 ? newSuggestions : s.suggestions;
              return { ...s, history: newHistory, suggestions: updatedSuggestions };
          }
          return s;
      }));
  };
  
  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim() || isLoading || isGeneratingTitle || !currentSessionId) return;

    const currentSession = sessions.find(s => s.id === currentSessionId);
    if (!currentSession) return;
    
    // Clear suggestions immediately
    setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, suggestions: [] } : s));
    
    const userMessage: DisplayableApiHistoryItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      parts: [{ text: userInput.trim() }],
    };
    
    updateSessionHistory(currentSessionId, prevHistory => [...prevHistory, userMessage]);
    setIsLoading(true);

    const isFirstUserMessage = currentSession.history.filter(h => h.role === 'user').length === 0;
    
    // Asynchronously generate title without blocking the chat flow
    if (isFirstUserMessage) {
        setIsGeneratingTitle(true);
        generateChatTitle(userInput).then(newTitle => {
            setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, title: newTitle } : s));
            setIsGeneratingTitle(false);
        }).catch(() => setIsGeneratingTitle(false));
    }

    try {
        const historyForApi = [...currentSession.history, userMessage]
            .filter(h => h.id.indexOf('initial-') === -1)
            .map(({ id, ...rest }) => rest);

        if (settings.responseMode === 'stream') {
            const aiStreamResponseId = `model-${Date.now()}`;
            const aiStreamResponse: DisplayableApiHistoryItem = { id: aiStreamResponseId, role: 'model', parts: [{ text: '' }] };
            updateSessionHistory(currentSessionId, prev => [...prev, aiStreamResponse]);

            let fullText = '';
            const stream = await sendMessageToAIStream(historyForApi, ragContent, settings, (finalSuggestions) => {
                setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, suggestions: finalSuggestions } : s));
            });

            for await (const textChunk of stream) {
                fullText += textChunk;
                updateSessionHistory(currentSessionId, prev => prev.map(h => h.id === aiStreamResponseId ? { ...h, parts: [{ text: fullText }] } : h));
            }
        } else {
             const { newTurns, suggestions } = await sendMessageToAI(historyForApi, ragContent, settings);
             const displayableNewTurns: DisplayableApiHistoryItem[] = newTurns.map((turn, i) => ({
                ...turn,
                id: `model-${Date.now()}-${i}`
             }));
             updateSessionHistory(currentSessionId, prev => [...prev, ...displayableNewTurns], suggestions);
        }
    } catch (error) {
        console.error("Error handling message:", error);
        const errorMessage: DisplayableApiHistoryItem = {
            id: `model-${Date.now()}`, role: 'model',
            parts: [{text: 'Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.'}],
        };
        updateSessionHistory(currentSessionId, prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  }, [isLoading, isGeneratingTitle, currentSessionId, sessions, ragContent, settings]);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  
  return (
    <ConfigProvider
      theme={{
        algorithm: effectiveTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <AntApp>
        <Layout style={{ minHeight: '100vh', width: '100vw' }}>
          <ChatSidebar
            isOpen={isSidebarOpen}
            sessions={sessions}
            currentSessionId={currentSessionId}
            onNewChat={handleNewChat}
            onSwitchChat={handleSwitchChat}
            onDeleteChat={handleDeleteChat}
            onDeleteAll={handleDeleteAll}
            onSettingsClick={() => setIsSettingsOpen(true)}
            onClose={() => setIsSidebarOpen(false)}
          />
          <Layout>
              <ChatHeader />
              <Content style={{ display: 'flex', flexDirection: 'column' }}>
                <ChatMessageList
                  history={currentSession?.history || []}
                  suggestions={currentSession?.suggestions || []}
                  isLoading={isLoading}
                  isRagLoading={ragContent === ''}
                  messagesEndRef={messagesEndRef}
                  onSuggestionClick={(suggestion) => handleSendMessage(suggestion)}
                />
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  isGeneratingTitle={isGeneratingTitle}
                  onMenuClick={() => setIsSidebarOpen(true)}
                />
              </Content>
          </Layout>
        </Layout>
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentSettings={settings}
          onSave={handleSaveSettings}
        />
      </AntApp>
    </ConfigProvider>
  );
};

export default App;