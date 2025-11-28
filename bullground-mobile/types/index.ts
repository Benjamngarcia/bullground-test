// Shared types matching the backend API contracts

export interface User {
  id: string;
  email: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount?: number;
}

export interface AuthResponse {
  user: User;
  session: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    expiresAt: number;
  };
  message: string;
}

export interface SendMessageRequest {
  conversationId?: string | null;
  message: string;
}

export interface SendMessageResponse {
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message;
}

export interface GetConversationsResponse {
  conversations: Conversation[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface GetConversationResponse {
  messages: Message[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiError {
  message: string;
  code: string;
}
