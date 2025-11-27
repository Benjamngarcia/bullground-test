import { type ReactNode } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  onNewConversation: () => void;
  currentConversationId: string | null;
}

export default function MainLayout({
  children,
  rightPanel,
  onNewConversation,
  currentConversationId,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-brand-darker overflow-hidden relative">
      <Sidebar
        onNewConversation={onNewConversation}
        currentConversationId={currentConversationId}
      />

      <main className="flex-1 flex flex-col min-w-0 max-w-2xl relative z-10">
        {children}
      </main>

      {rightPanel && rightPanel}
    </div>
  );
}
