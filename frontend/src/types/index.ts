export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
  status?: 'sending' | 'sent' | 'error';
}

export interface Conversation {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  messageCount?: number;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  emailConfirmed?: boolean;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
}

export interface AuthResponse {
  user: User;
  session: AuthSession;
  message: string;
}

export interface PortfolioStats {
  totalAUM: string;
  clients: number;
  leads: number;
  growth: {
    percentage: string;
    amount: string;
  };
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  conversationId: string | null;
}
