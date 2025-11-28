import { type ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { IconChartBar, IconX, IconMenu2 } from '@tabler/icons-react';

interface MainLayoutProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  onNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
  currentConversationId: string | null;
}

export default function MainLayout({
  children,
  rightPanel,
  onNewConversation,
  onSelectConversation,
  currentConversationId,
}: MainLayoutProps) {
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMedium, setIsMedium] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 768;
      const medium = window.innerWidth >= 768 && window.innerWidth < 1280;

      setIsMobile(mobile);
      setIsMedium(medium);

      // Auto-hide right panel on medium screens, show on large
      if (medium) {
        setShowRightPanel(false);
      } else if (window.innerWidth >= 1280) {
        setShowRightPanel(true);
      }
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/bullgra-bg.svg')" }}
      />

      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setShowSidebar(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-white hover:bg-zinc-800 transition-colors"
          aria-label="Open menu"
        >
          <IconMenu2 size={24} stroke={1.5} />
        </button>
      )}

      {/* Sidebar - hidden on mobile by default */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'}
        ${isMobile && !showSidebar ? '-translate-x-full' : 'translate-x-0'}
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar
          onNewConversation={() => {
            onNewConversation();
            if (isMobile) setShowSidebar(false);
          }}
          onSelectConversation={(id) => {
            onSelectConversation(id);
            if (isMobile) setShowSidebar(false);
          }}
          currentConversationId={currentConversationId}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main content */}
      <main className={`
        flex-1 flex flex-col min-w-0 relative z-10
        ${!isMobile ? 'max-w-2xl' : ''}
      `}>
        {children}
      </main>

      {/* Right panel toggle button - show on medium+ screens when panel exists */}
      {rightPanel && !isMobile && (
        <button
          onClick={() => setShowRightPanel(!showRightPanel)}
          className={`
            fixed top-4 right-4 z-30 p-2 rounded-lg
            bg-zinc-900/90 border border-zinc-800 text-white
            hover:bg-zinc-800 transition-all duration-300
            ${showRightPanel ? 'translate-x-0' : 'translate-x-0'}
          `}
          aria-label={showRightPanel ? 'Hide portfolio' : 'Show portfolio'}
        >
          {showRightPanel ? (
            <IconX size={20} stroke={1.5} />
          ) : (
            <IconChartBar size={20} stroke={1.5} />
          )}
        </button>
      )}

      {/* Right panel with slide animation */}
      {rightPanel && (
        <div className={`
          ${isMobile ? 'hidden' : ''}
          ${showRightPanel ? 'translate-x-0' : 'translate-x-full'}
          transition-transform duration-300 ease-in-out
          ${isMedium || !showRightPanel ? 'fixed right-0 top-0 bottom-0 z-20' : 'relative'}
        `}>
          {rightPanel}
        </div>
      )}

      {!isMobile && isMedium && showRightPanel && (
        <div
          className="fixed inset-0 bg-black/30 z-10"
          onClick={() => setShowRightPanel(false)}
        />
      )}
    </div>
  );
}
