import { useState, useEffect } from 'react';
import {
  IconMessage,
  IconDots,
  IconBriefcase,
  IconUserSquare,
  IconUserSearch,
  IconChartPie,
  IconBook2,
  IconEdit,
} from '@tabler/icons-react';
import { useAuth } from '../features/auth/contexts/AuthContext';
import { getConversations } from '../features/chat/api/chatApi';
import type { Conversation } from '../types';

interface SidebarProps {
  onNewConversation: () => void;
  currentConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export default function Sidebar({ onNewConversation, currentConversationId, onSelectConversation }: SidebarProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { id: 'portfolio', label: 'Portfolio', Icon: IconBriefcase },
    { id: 'clients', label: 'Clients', Icon: IconUserSquare },
    { id: 'leads', label: 'Leads', Icon: IconUserSearch },
    { id: 'strategies', label: 'Strategies', Icon: IconChartPie },
    { id: 'resources', label: 'Resources', Icon: IconBook2 },
  ];

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const data = await getConversations(20, 0);
        setConversations(data.conversations);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, []);

  // Reload conversations when currentConversationId changes (new conversation created)
  useEffect(() => {
    if (currentConversationId) {
      const loadConversations = async () => {
        try {
          const data = await getConversations(20, 0);
          setConversations(data.conversations);
        } catch (error) {
          console.error('Failed to load conversations:', error);
        }
      };

      loadConversations();
    }
  }, [currentConversationId]);

  const formatConversationTitle = (conversation: Conversation) => {
    if (conversation.title) {
      return conversation.title;
    }
    // Format date as fallback
    const date = new Date(conversation.createdAt);
    return `Chat ${date.toLocaleDateString()}`;
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <aside className="w-80 bg-[#292929]/50 border-linear-to-b from-[#939393] to-white backdrop-blur-[10px] shadow-[0_10px_0_0_rgba(0,0,0,0.15)] flex flex-col relative z-10" style={{ backdropFilter: 'blur(50px)' }}>
      <div className="pt-9 pr-6 pb-6 pl-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-transparent border-2 border-white rounded flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">BULLGROUND</h1>
            <p className="text-xs text-zinc-400">Advisors</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        <button
          onClick={onNewConversation}
          className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
        >
          <IconEdit size={20} stroke={1.2} />
          <span>New conversation</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors mb-1 text-sm ${
              activeTab === item.id
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300'
            }`}
          >
            <item.Icon size={20} stroke={1.2} />
            <span className="font-normal">{item.label}</span>
          </button>
        ))}

        <div className="mt-8 mb-4">
          <div className="flex items-center gap-2 px-3 mb-3">
            <IconMessage size={16} stroke={1.5} className="text-zinc-500" />
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Recent Chats</h3>
          </div>

          {isLoadingConversations ? (
            <div className="px-3 py-2 text-sm text-zinc-500">Loading...</div>
          ) : conversations.length > 0 ? (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between gap-2 transition-colors text-sm group ${
                    currentConversationId === conversation.id
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300'
                  }`}
                >
                  <div className="flex-1 min-w-0 text-left">
                    <p className="truncate text-sm">
                      {formatConversationTitle(conversation)}
                    </p>
                    {conversation.messageCount !== undefined && conversation.messageCount > 0 && (
                      <p className="text-xs text-zinc-600 mt-0.5">
                        {conversation.messageCount} {conversation.messageCount === 1 ? 'message' : 'messages'}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-zinc-600 flex-shrink-0">
                    {formatDate(conversation.updatedAt)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2 text-sm text-zinc-600">No conversations yet</div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs text-zinc-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors"
            title="Options"
          >
            <IconDots size={18} stroke={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}
