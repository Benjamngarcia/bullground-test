import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import ScrollToBottom from './ScrollToBottom';
import type { Message } from '../types';
import { sendMessage, getConversation } from '../api/chatApi';

interface ChatWindowProps {
  conversationId: string | null;
  onConversationCreated: (id: string) => void;
}

export default function ChatWindow({ conversationId, onConversationCreated }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userHasScrolledUp = useRef(false);

  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) {
        setMessages([]);
        return;
      }

      try {
        const data = await getConversation(conversationId);
        setMessages(
          data.messages.map(msg => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
            status: 'sent' as const,
          }))
        );
      } catch (err) {
        console.error('Error loading conversation:', err);
        setError('Failed to load conversation');
      }
    };

    loadMessages();
  }, [conversationId]);

  useEffect(() => {
    if (!userHasScrolledUp.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    userHasScrolledUp.current = !isNearBottom;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    userHasScrolledUp.current = false;
    setShowScrollButton(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const userMessage: Message = {
      id: tempId,
      role: 'user',
      content: content.trim(),
      createdAt: new Date(),
      status: 'sending',
    };

    setMessages(prev => [...prev, userMessage]);
    setError(null);

    try {
      setIsTyping(true);

      const response = await sendMessage({
        conversationId: conversationId,
        message: content.trim(),
      });

      setMessages(prev => [
        ...prev.filter(msg => msg.id !== tempId),
        {
          ...response.userMessage,
          createdAt: new Date(response.userMessage.createdAt),
          status: 'sent' as const,
        },
        {
          ...response.assistantMessage,
          createdAt: new Date(response.assistantMessage.createdAt),
          status: 'sent' as const,
        },
      ]);

      if (!conversationId && response.conversationId) {
        onConversationCreated(response.conversationId);
      }
    } catch (err) {
      console.error('Error sending message:', err);

      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);

      setMessages(prev =>
        prev.map(msg => (msg.id === tempId ? { ...msg, status: 'error' as const } : msg))
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.role === 'user') {
      handleSendMessage(message.content);
    }
  };

  return (
    <div className="flex flex-col h-full bg-brand-darker">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center">
              <span className="text-white text-sm font-bold">🤖</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">WiMA</h2>
              <p className="text-xs text-brand-text-muted">Financial Advisory AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-brand-gray transition-colors text-brand-text-muted hover:text-brand-text"
              aria-label="Users"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </button>
            <button
              className="p-2 rounded-lg hover:bg-brand-gray transition-colors text-brand-text-muted hover:text-brand-text"
              aria-label="Strategies"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              className="p-2 rounded-lg hover:bg-brand-gray transition-colors text-brand-text-muted hover:text-brand-text"
              aria-label="Stocks"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              className="p-2 rounded-lg hover:bg-brand-gray transition-colors text-brand-text-muted hover:text-brand-text"
              aria-label="Insights"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-accent/20 flex items-center justify-center">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Hello! I'm WiMA, your financial advisor.
              </h3>
              <p className="text-brand-text-muted">
                Ask me anything about your portfolio, investments, or financial strategies.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLastMessage={index === messages.length - 1}
            onRetry={() => handleRetry(message.id)}
          />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && <ScrollToBottom onClick={scrollToBottom} />}

      <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
}
