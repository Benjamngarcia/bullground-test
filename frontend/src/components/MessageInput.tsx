import { useState, useRef, useEffect, type KeyboardEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (!message.trim() || disabled) return;

    onSendMessage(message);
    setMessage('');

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-gray-800 bg-brand-dark">
      <div className="px-6 py-4">
        <div className="flex items-end gap-3">
          <button
            type="button"
            className="flex-shrink-0 p-2 rounded-lg text-brand-text-muted hover:text-brand-text hover:bg-brand-gray transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
            aria-label="Attach file"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask WiMA anything you want..."
              disabled={disabled}
              rows={1}
              className="w-full px-4 py-3 bg-brand-gray border border-gray-700 rounded-xl text-brand-text placeholder-brand-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{
                minHeight: '48px',
                maxHeight: '150px',
              }}
              aria-label="Message input"
            />

            {message.length > 500 && (
              <div className="absolute bottom-2 right-2 text-xs text-brand-text-muted">
                {message.length}/1000
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className={`flex-shrink-0 p-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent ${
              canSend
                ? 'bg-brand-accent hover:bg-brand-accent/90 text-white shadow-lg shadow-brand-accent/20 hover:shadow-brand-accent/30'
                : 'bg-brand-gray text-brand-text-muted cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>

        <div className="mt-2 text-xs text-brand-text-muted text-center">
          Press <kbd className="px-1.5 py-0.5 bg-brand-gray border border-gray-700 rounded text-xs">Enter</kbd> to send,
          <kbd className="px-1.5 py-0.5 bg-brand-gray border border-gray-700 rounded text-xs ml-1">Shift + Enter</kbd> for new line
        </div>
      </div>
    </div>
  );
}
