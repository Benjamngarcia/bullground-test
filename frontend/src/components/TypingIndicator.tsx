export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center">
        <span className="text-white text-sm font-semibold">🤖</span>
      </div>

      <div className="flex-1 max-w-2xl">
        <div className="rounded-2xl px-4 py-3 bg-brand-gray border border-gray-700 shadow-lg inline-block">
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 bg-brand-text-muted rounded-full animate-pulse-slow"
              style={{ animationDelay: '0s' }}
            ></div>
            <div
              className="w-2 h-2 bg-brand-text-muted rounded-full animate-pulse-slow"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="w-2 h-2 bg-brand-text-muted rounded-full animate-pulse-slow"
              style={{ animationDelay: '0.4s' }}
            ></div>
          </div>
        </div>

        <div className="mt-1 px-2 text-xs text-brand-text-muted flex items-center gap-1">
          <span className="font-medium">WiMA</span>
          <span className="opacity-60">• is typing...</span>
        </div>
      </div>
    </div>
  );
}
