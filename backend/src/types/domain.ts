export interface Conversation {
  id: string;
  userId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export type RiskProfile = 'conservative' | 'balanced' | 'aggressive';

export interface UserContext {
  userId: string;
  riskProfile?: RiskProfile;
  preferences?: Record<string, unknown>;
}

export interface NewMessage {
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface NewConversation {
  userId: string;
  title?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
