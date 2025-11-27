import type { Message } from '../types';
import { IconRobot } from '@tabler/icons-react';

interface MessageBubbleProps {
  message: Message;
  isLastMessage?: boolean;
  onRetry?: () => void;
}

export default function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const isSending = message.status === 'sending';

  if (isUser) {
    return (
      <div className="flex items-start gap-3 justify-end">
        <div className="max-w-2xl">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3">
            <p className="text-sm text-zinc-100 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            {isSending && (
              <div className="mt-2 text-xs text-zinc-500">Sending...</div>
            )}
            {isError && onRetry && (
              <div className="mt-2">
                <button
                  onClick={onRetry}
                  className="text-xs text-red-400 hover:text-red-300 underline"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
        <IconRobot size={16} stroke={1.5} className="text-emerald-500" />
      </div>

      <div className="flex-1 max-w-2xl">
        <div className="mb-1.5">
          <span className="text-xs font-medium text-white">WiMA</span>
        </div>
        <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  );
}
