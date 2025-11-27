import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import ScrollToBottom from '../../../shared/components/ScrollToBottom';
import type { Message } from '../../../types';
import { sendMessage, getConversation } from '../api/chatApi';
import { IconRobot } from '@tabler/icons-react';

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
    <div className="flex flex-col h-full bg-brand-dark">
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
              <div className="text-center max-w-md animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <IconRobot size={32} stroke={1.5} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Sure, here it is:
                </h3>
                <p className="text-sm text-zinc-500">
                  Ask me anything about your portfolio, investments, or financial strategies.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
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
      </div>

      {showScrollButton && <ScrollToBottom onClick={scrollToBottom} />}

      <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
}
