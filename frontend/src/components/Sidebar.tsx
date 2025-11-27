import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  onNewConversation: () => void;
  currentConversationId: string | null;
}

export default function Sidebar({ onNewConversation }: SidebarProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { id: 'portfolio', label: 'Portfolio', icon: '📊' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'leads', label: 'Leads', icon: '🎯' },
    { id: 'strategies', label: 'Strategies', icon: '⚡' },
    { id: 'resources', label: 'Resources', icon: '📚' },
  ];

  const quickLinks = [
    'User with <10% ROI',
    'List of underpriced stocks',
    'Nvidia analysis',
    'High risk portfolios',
  ];

  return (
    <aside className="w-72 bg-brand-dark border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center text-white font-bold">
            🐂
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">BULLGROUND</h1>
            <p className="text-xs text-brand-text-muted">Advisors</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onNewConversation}
          className="w-full px-4 py-2.5 bg-brand-gray hover:bg-gray-700 text-brand-text rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent"
          aria-label="Start new conversation"
        >
          <span className="text-lg">✏️</span>
          <span className="font-medium">New conversation</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors mb-1 ${
                activeTab === item.id
                  ? 'bg-brand-gray text-white'
                  : 'text-brand-text-muted hover:bg-brand-gray/50 hover:text-brand-text'
              }`}
              aria-label={item.label}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 px-4 pb-4">
          <div className="border-t border-gray-800 pt-4">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                className="w-full text-left px-2 py-1.5 text-sm text-brand-text-muted hover:text-brand-text transition-colors"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.email || 'User'}</p>
            <p className="text-xs text-brand-text-muted truncate">
              {user?.emailConfirmed ? 'Verified' : 'Not verified'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-brand-text-muted hover:text-red-400 hover:bg-brand-gray rounded-lg transition-colors"
            aria-label="Logout"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
