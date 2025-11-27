import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import RightPanel from './components/RightPanel';
import './index.css';

type AuthView = 'login' | 'signup';

function App() {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(() => {
    return localStorage.getItem('currentConversationId');
  });

  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem('currentConversationId', currentConversationId);
    } else {
      localStorage.removeItem('currentConversationId');
    }
  }, [currentConversationId]);

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginPage onSwitchToSignup={() => setAuthView('signup')} />
    ) : (
      <SignupPage onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-brand-darker overflow-hidden">
        <Sidebar
          onNewConversation={() => setCurrentConversationId(null)}
          currentConversationId={currentConversationId}
        />

        <main className="flex-1 flex flex-col min-w-0">
          <ChatWindow
            conversationId={currentConversationId}
            onConversationCreated={setCurrentConversationId}
          />
        </main>

        <RightPanel />
      </div>
    </ProtectedRoute>
  );
}

export default App;
