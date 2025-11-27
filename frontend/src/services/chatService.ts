import { authService } from './authService';
import type { Message, Conversation } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface SendMessageRequest {
  conversationId?: string | null;
  message: string;
}

interface SendMessageResponse {
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message;
}

interface GetConversationsResponse {
  conversations: Conversation[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

interface GetConversationResponse {
  conversation: Conversation;
  messages: Message[];
}

/**
 * Chat Service
 * Handles all chat-related API calls
 */
class ChatService {
  /**
   * Send a message and get assistant response
   */
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await authService.authenticatedRequest(
      `${API_BASE_URL}/chat/messages`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to send message');
    }

    return response.json();
  }

  /**
   * Get all conversations for the current user
   */
  async getConversations(
    limit: number = 50,
    offset: number = 0
  ): Promise<GetConversationsResponse> {
    const response = await authService.authenticatedRequest(
      `${API_BASE_URL}/chat/conversations?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch conversations');
    }

    return response.json();
  }

  /**
   * Get a specific conversation with all messages
   */
  async getConversation(conversationId: string): Promise<GetConversationResponse> {
    const response = await authService.authenticatedRequest(
      `${API_BASE_URL}/chat/conversations/${conversationId}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch conversation');
    }

    return response.json();
  }

  /**
   * Update conversation title
   */
  async updateConversation(
    conversationId: string,
    title: string
  ): Promise<Conversation> {
    const response = await authService.authenticatedRequest(
      `${API_BASE_URL}/chat/conversations/${conversationId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ title }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to update conversation');
    }

    const data = await response.json();
    return data.conversation;
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    const response = await authService.authenticatedRequest(
      `${API_BASE_URL}/chat/conversations/${conversationId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to delete conversation');
    }
  }
}

export const chatService = new ChatService();
