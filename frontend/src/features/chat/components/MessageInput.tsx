import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { IconPaperclip, IconArrowUp, IconUsers, IconLayoutGrid, IconTrendingUp, IconFileText } from '@tabler/icons-react';

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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
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
    <div className="px-6 pb-6 pt-3 max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Main input container - rounded pill shape */}
        <div className="relative">
          <div
            className="rounded-2xl border backdrop-blur-sm px-6 py-4"
            style={{
              backgroundColor: 'rgba(41, 41, 41, 0.5)',
              borderColor: 'rgba(147, 147, 147, 0.3)',
            }}
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask WiMA anything you want..."
              disabled={disabled}
              rows={3}
              className="w-full bg-transparent text-base text-zinc-400 placeholder-zinc-500 resize-none focus:outline-none disabled:opacity-50 pr-20 pb-10"
              style={{
                minHeight: '80px',
                maxHeight: '160px',
              }}
            />

            {/* Buttons positioned in bottom right */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                type="button"
                className="shrink-0 p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors disabled:opacity-50"
                disabled={disabled}
              >
                <IconPaperclip size={18} stroke={1.5} />
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                className={`shrink-0 p-2 rounded-full transition-all ${
                  canSend
                    ? 'bg-zinc-700 hover:bg-zinc-600 text-white'
                    : 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
                }`}
              >
                <IconArrowUp size={18} stroke={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center justify-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700/50 bg-zinc-900/30 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/40 transition-all backdrop-blur-sm">
            <IconUsers size={18} stroke={1.5} />
            <span>Users</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700/50 bg-zinc-900/30 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/40 transition-all backdrop-blur-sm">
            <IconLayoutGrid size={18} stroke={1.5} />
            <span>Strategies</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700/50 bg-zinc-900/30 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/40 transition-all backdrop-blur-sm">
            <IconTrendingUp size={18} stroke={1.5} />
            <span>Stocks</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700/50 bg-zinc-900/30 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/40 transition-all backdrop-blur-sm">
            <IconFileText size={18} stroke={1.5} />
            <span>Insights</span>
          </button>
        </div>
      </div>
    </div>
  );
}
