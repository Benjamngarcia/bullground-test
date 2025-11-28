import { IconChevronDown } from '@tabler/icons-react';

interface ScrollToBottomProps {
  onClick: () => void;
}

export default function ScrollToBottom({ onClick }: ScrollToBottomProps) {
  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 animate-fade-in">
      <button
        onClick={onClick}
        className="group flex items-center justify-center w-10 h-10 bg-zinc-800/90 hover:bg-zinc-700 backdrop-blur-sm border border-zinc-700 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
        aria-label="Scroll to bottom"
      >
        <IconChevronDown
          size={20}
          stroke={2}
          className="text-zinc-400 group-hover:text-white transition-colors"
        />
      </button>
    </div>
  );
}
