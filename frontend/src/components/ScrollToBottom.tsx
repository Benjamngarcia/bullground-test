interface ScrollToBottomProps {
  onClick: () => void;
}

export default function ScrollToBottom({ onClick }: ScrollToBottomProps) {
  return (
    <div className="absolute bottom-24 right-6 z-10 animate-fade-in">
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-full shadow-lg shadow-brand-accent/20 hover:shadow-brand-accent/30 transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-darker"
        aria-label="Scroll to bottom"
      >
        <span className="text-sm font-medium">Scroll to bottom</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );
}
