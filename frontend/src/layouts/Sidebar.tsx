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
  IconX,
} from '@tabler/icons-react';
import { useAuth } from '../features/auth/contexts/AuthContext';
import { getConversations, deleteConversation } from '../features/chat/api/chatApi';
import Modal from '../shared/ui/Modal';
import Button from '../shared/ui/Button';
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = (conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversationToDelete(conversation);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!conversationToDelete) return;

    try {
      setIsDeleting(true);
      await deleteConversation(conversationToDelete.id);

      // Remove from list
      setConversations(prev => prev.filter(c => c.id !== conversationToDelete.id));

      // If deleted conversation was active, clear selection
      if (currentConversationId === conversationToDelete.id) {
        onNewConversation();
      }

      setDeleteModalOpen(false);
      setConversationToDelete(null);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setConversationToDelete(null);
  };

  return (
    <aside className="w-80 h-full bg-[#292929]/50 border-linear-to-b from-[#939393] to-white backdrop-blur-[10px] shadow-[0_10px_0_0_rgba(0,0,0,0.15)] flex flex-col relative z-10" style={{ backdropFilter: 'blur(50px)' }}>
      <div className="pt-9 pr-6 pb-6 pl-6">
        <div className="flex items-center gap-4">
            <img src="https://bullground.app/logo-white.png" alt="Bullground logo" />
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
                <div
                  key={conversation.id}
                  className={`relative group/item rounded-lg transition-colors ${
                    currentConversationId === conversation.id
                      ? 'bg-zinc-800'
                      : 'hover:bg-zinc-900'
                  }`}
                >
                  <div className="w-full px-3 py-2.5 flex items-center gap-2 text-sm">
                    <button
                      onClick={() => onSelectConversation(conversation.id)}
                      className={`flex-1 min-w-0 text-left ${
                        currentConversationId === conversation.id
                          ? 'text-white'
                          : 'text-zinc-400 group-hover/item:text-zinc-300'
                      }`}
                    >
                      <p className="truncate text-sm">
                        {formatConversationTitle(conversation)}
                      </p>
                      {conversation.messageCount !== undefined && conversation.messageCount > 0 && (
                        <p className="text-xs text-zinc-600 mt-0.5">
                          {conversation.messageCount} {conversation.messageCount === 1 ? 'message' : 'messages'}
                        </p>
                      )}
                    </button>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs text-zinc-600">
                        {formatDate(conversation.updatedAt)}
                      </span>
                      <button
                        onClick={(e) => handleDeleteClick(conversation, e)}
                        className="p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                        title="Delete conversation"
                      >
                        <IconX size={14} stroke={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        title="Delete Conversation"
      >
        <div className="space-y-4">
          <p className="text-zinc-300">
            Are you sure you want to delete "{conversationToDelete ? formatConversationTitle(conversationToDelete) : ''}"?
          </p>
          <p className="text-sm text-zinc-500">
            This action cannot be undone.
          </p>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="ghost"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </aside>
  );
}
