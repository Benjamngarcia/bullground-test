import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isLastMessage?: boolean;
  onRetry?: () => void;
}

export default function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const isSending = message.status === 'sending';

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div
      className={`flex items-start gap-3 animate-slide-up ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
            : 'bg-brand-accent'
        }`}
      >
        <span className="text-white text-sm font-semibold">
          {isUser ? '👤' : '🤖'}
        </span>
      </div>

      <div className={`flex-1 max-w-2xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-brand-accent text-white'
              : 'bg-brand-gray text-brand-text border border-gray-700'
          } ${isError ? 'border-red-500 bg-red-900/20' : ''} ${
            isSending ? 'opacity-60' : ''
          } shadow-lg transition-all duration-200`}
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words m-0">
              {message.content}
            </p>
          </div>

          {isSending && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-xs opacity-70">Sending...</span>
            </div>
          )}

          {isError && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-red-400">Failed to send</span>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-xs text-red-400 hover:text-red-300 underline focus:outline-none"
                  aria-label="Retry sending message"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>

        <div
          className={`mt-1 px-2 text-xs text-brand-text-muted ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {formatTime(message.createdAt)}
          {message.status === 'sent' && isUser && (
            <span className="ml-1" aria-label="Message sent">
              ✓
            </span>
          )}
        </div>

        {!isUser && (
          <div className="mt-1 px-2 text-xs text-brand-text-muted flex items-center gap-1">
            <span className="font-medium">WiMA</span>
            <span className="opacity-60">• AI Assistant</span>
          </div>
        )}
      </div>
    </div>
  );
}
