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
    <div className="border-t border-brand-border bg-linear-to-t from-black/40 to-brand-darker/20 backdrop-blur-sm">
      <div className="px-6 py-6 max-w-4xl mx-auto">
        <div className="flex items-end gap-3 bg-zinc-900/80 rounded-2xl border border-zinc-800/50 p-3 shadow-lg">
          <div className="flex-1 relative flex items-end">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask WiMA anything you want..."
              disabled={disabled}
              rows={1}
              className="w-full px-4 py-3 bg-transparent text-base text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none disabled:opacity-50"
              style={{
                minHeight: '56px',
                maxHeight: '160px',
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex-shrink-0 p-2.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors disabled:opacity-50"
              disabled={disabled}
            >
              <IconPaperclip size={20} stroke={1.5} />
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className={`flex-shrink-0 p-2.5 rounded-lg transition-all ${
                canSend
                  ? 'bg-brand-accent hover:bg-brand-accent/80 text-white'
                  : 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <IconArrowUp size={20} stroke={2} />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/30 transition-all">
            <IconUsers size={16} stroke={1.5} />
            <span>Users</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/30 transition-all">
            <IconLayoutGrid size={16} stroke={1.5} />
            <span>Strategies</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/30 transition-all">
            <IconTrendingUp size={16} stroke={1.5} />
            <span>Stocks</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/30 transition-all">
            <IconFileText size={16} stroke={1.5} />
            <span>Insights</span>
          </button>
        </div>
      </div>
    </div>
  );
}
