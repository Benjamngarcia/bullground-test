import { useState, useEffect } from 'react';
import { useAuth } from './features/auth/contexts/AuthContext';
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import ChatWindow from './features/chat/components/ChatWindow';
import RightPanel from './features/portfolio/components/RightPanel';
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
      <MainLayout
        onNewConversation={() => setCurrentConversationId(null)}
        currentConversationId={currentConversationId}
        rightPanel={<RightPanel />}
      >
        <ChatWindow
          conversationId={currentConversationId}
          onConversationCreated={setCurrentConversationId}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}

export default App;
