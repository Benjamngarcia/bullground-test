import { IconRobot } from '@tabler/icons-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
        <IconRobot size={16} stroke={1.5} className="text-emerald-500" />
      </div>

      <div className="flex-1">
        <div className="mb-1.5">
          <span className="text-xs font-medium text-white">WiMA</span>
        </div>
        <div className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
          <div
            className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse-slow"
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse-slow"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse-slow"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
