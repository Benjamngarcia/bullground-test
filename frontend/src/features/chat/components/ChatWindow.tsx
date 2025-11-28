import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import ScrollToBottom from '../../../shared/components/ScrollToBottom';
import type { Message } from '../../../types';
import { sendMessageStreaming, getConversation } from '../api/chatApi';
import { IconRobot } from '@tabler/icons-react';

interface ChatWindowProps {
  conversationId: string | null;
  onConversationCreated: (id: string) => void;
}

export default function ChatWindow({ conversationId, onConversationCreated }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userHasScrolledUp = useRef(false);

  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) {
        setMessages([]);
        setIsLoadingConversation(false);
        return;
      }

      try {
        setIsLoadingConversation(true);
        setMessages([]); // Clear messages immediately for smooth transition
        setError(null);

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
      } finally {
        setIsLoadingConversation(false);
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

    let assistantMessageId: string | null = null;
    let displayedContent = '';
    let chunkBuffer: string[] = [];
    let animationFrame: number | null = null;

    // Character-by-character animation
    const animateCharacters = () => {
      if (chunkBuffer.length === 0 || !assistantMessageId) {
        animationFrame = null;
        return;
      }

      const char = chunkBuffer.shift()!;
      displayedContent += char;

      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: displayedContent }
            : msg
        )
      );

      // Continue animation with slight delay for typing effect
      animationFrame = window.requestAnimationFrame(() => {
        setTimeout(animateCharacters, 20); // 20ms between characters for smooth typing
      });
    };

    try {
      setIsTyping(true);

      for await (const event of sendMessageStreaming({
        conversationId: conversationId,
        message: content.trim(),
      })) {
        if (event.type === 'metadata') {
          setMessages(prev => [
            ...prev.filter(msg => msg.id !== tempId),
            {
              ...event.userMessage,
              createdAt: new Date(event.userMessage.createdAt),
              status: 'sent' as const,
            },
          ]);

          // Update conversation ID if new
          if (!conversationId && event.conversationId) {
            onConversationCreated(event.conversationId);
          }

          setIsTyping(false);

          // Create placeholder for streaming assistant message
          assistantMessageId = `streaming-${Date.now()}`;
          setMessages(prev => [
            ...prev,
            {
              id: assistantMessageId!,
              role: 'assistant' as const,
              content: '',
              createdAt: new Date(),
              status: 'sending' as const,
            },
          ]);
        } else if (event.type === 'chunk') {
          // Add characters to buffer for animation
          const chars = event.text.split('');
          chunkBuffer.push(...chars);

          // Start animation if not already running
          if (!animationFrame) {
            animateCharacters();
          }
        } else if (event.type === 'done') {
          // Cancel any pending animation
          if (animationFrame) {
            window.cancelAnimationFrame(animationFrame);
          }

          // Clear buffer and show final message immediately
          chunkBuffer = [];

          // Replace streaming message with final message
          setMessages(prev => [
            ...prev.filter(msg => msg.id !== assistantMessageId),
            {
              ...event.assistantMessage,
              createdAt: new Date(event.assistantMessage.createdAt),
              status: 'sent' as const,
            },
          ]);
        } else if (event.type === 'error') {
          setError(event.message);
          throw new Error(event.message);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);

      // Cancel animation on error
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);

      // Remove streaming message and mark user message as error
      setMessages(prev =>
        prev
          .filter(msg => msg.id !== assistantMessageId)
          .map(msg => (msg.id === tempId ? { ...msg, status: 'error' as const } : msg))
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
    <div className="flex flex-col h-full">
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {isLoadingConversation ? (
            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
              <div className="text-center max-w-md animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Loading conversation...
                </h3>
                <p className="text-sm text-zinc-500">
                  Please wait while we load your messages.
                </p>
              </div>
            </div>
          ) : messages.length === 0 && !conversationId ? (
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
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {showScrollButton && <ScrollToBottom onClick={scrollToBottom} />}

      <MessageInput onSendMessage={handleSendMessage} disabled={isTyping || isLoadingConversation} />
    </div>
  );
}
