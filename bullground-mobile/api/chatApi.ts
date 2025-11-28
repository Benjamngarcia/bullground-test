// Chat API - matching the web app's chat endpoints
import { apiClient } from './client';
import {
  SendMessageRequest,
  SendMessageResponse,
  GetConversationsResponse,
  GetConversationResponse,
  Conversation,
  Message,
} from '../types';

/**
 * Send a message to the chat
 * POST /chat/messages
 */
export async function sendMessage(
  request: SendMessageRequest
): Promise<SendMessageResponse> {
  const response = await apiClient.axios.post<SendMessageResponse>(
    '/chat/messages',
    request
  );

  // Parse dates
  return {
    ...response.data,
    userMessage: {
      ...response.data.userMessage,
      createdAt: new Date(response.data.userMessage.createdAt),
    },
    assistantMessage: {
      ...response.data.assistantMessage,
      createdAt: new Date(response.data.assistantMessage.createdAt),
    },
  };
}

/**
 * Get list of conversations
 * GET /chat/conversations
 */
export async function getConversations(
  limit: number = 50,
  offset: number = 0
): Promise<GetConversationsResponse> {
  const response = await apiClient.axios.get<GetConversationsResponse>(
    '/chat/conversations',
    {
      params: { limit, offset },
    }
  );

  // Parse dates
  return {
    ...response.data,
    conversations: response.data.conversations.map((conv) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
    })),
  };
}

/**
 * Get messages for a specific conversation
 * GET /chat/conversations/:id/messages
 */
export async function getConversation(
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<GetConversationResponse> {
  const response = await apiClient.axios.get<GetConversationResponse>(
    `/chat/conversations/${conversationId}/messages`,
    {
      params: { limit, offset },
    }
  );

  // Parse dates
  return {
    ...response.data,
    messages: response.data.messages.map((msg) => ({
      ...msg,
      createdAt: new Date(msg.createdAt),
    })),
  };
}

/**
 * Update conversation title
 * PATCH /chat/conversations/:id
 */
export async function updateConversation(
  conversationId: string,
  title: string
): Promise<Conversation> {
  const response = await apiClient.axios.patch<{ conversation: Conversation }>(
    `/chat/conversations/${conversationId}`,
    { title }
  );

  return {
    ...response.data.conversation,
    createdAt: new Date(response.data.conversation.createdAt),
    updatedAt: new Date(response.data.conversation.updatedAt),
  };
}

/**
 * Delete a conversation (soft delete)
 * DELETE /chat/conversations/:id
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  await apiClient.axios.delete(`/chat/conversations/${conversationId}`);
}
