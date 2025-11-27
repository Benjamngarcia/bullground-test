import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  IconChartBar,
  IconUsers,
  IconTarget,
  IconBolt,
  IconBook,
  IconSquareRoundedPlus,
  IconDots
} from '@tabler/icons-react';

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
    { id: 'portfolio', label: 'Portfolio', Icon: IconChartBar },
    { id: 'clients', label: 'Clients', Icon: IconUsers },
    { id: 'leads', label: 'Leads', Icon: IconTarget },
    { id: 'strategies', label: 'Strategies', Icon: IconBolt },
    { id: 'resources', label: 'Resources', Icon: IconBook },
  ];

  const quickLinks = [
    'User with <10% ROI',
    'List of underpriced stocks',
    'Nvidia analysis',
    'High risk portfolios',
  ];

  return (
    <aside className="w-72 bg-brand-darker border-r border-brand-border flex flex-col relative z-10">
      <div className="p-5 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-zinc-800 rounded-md flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-white tracking-tight">BULLGROUND</h1>
            <p className="text-xs text-zinc-500">Advisors</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-4 border-b border-brand-border">
        <button
          onClick={onNewConversation}
          className="w-full px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 rounded-md flex items-center gap-2 transition-colors text-sm font-medium"
        >
          <IconSquareRoundedPlus size={18} stroke={1.5} />
          <span>New conversation</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full px-3 py-2 rounded-md flex items-center gap-2.5 transition-colors mb-0.5 text-sm ${
              activeTab === item.id
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-300'
            }`}
          >
            <item.Icon size={18} stroke={1.5} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        <div className="mt-6 pt-3 border-t border-brand-border">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
            >
              {link}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
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
