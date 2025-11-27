import { Message, Conversation } from './domain';

export interface PostMessageRequest {
  conversationId?: string;
  message: string;
}

export interface RenameConversationRequest {
  title: string;
}

export interface PostMessageResponse {
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message;
  messages?: Message[];
}

export interface ListConversationsResponse {
  conversations: Conversation[];
  total: number;
  limit: number;
  offset: number;
}

export interface GetMessagesResponse {
  messages: Message[];
  total: number;
  limit: number;
  offset: number;
}

export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
