import { apiClient } from '../lib/apiClient';
import type { Message, Conversation } from '../types';

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
  messages: Message[];
  total: number;
  limit: number;
  offset: number;
}

export async function sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
  const response = await apiClient.post<SendMessageResponse>('/chat/messages', request);
  return response.data;
}

export async function getConversations(
  limit: number = 50,
  offset: number = 0
): Promise<GetConversationsResponse> {
  const response = await apiClient.get<GetConversationsResponse>('/chat/conversations', {
    params: { limit, offset },
  });
  return response.data;
}

export async function getConversation(conversationId: string): Promise<GetConversationResponse> {
  const response = await apiClient.get<GetConversationResponse>(
    `/chat/conversations/${conversationId}/messages`
  );
  return response.data;
}

export async function updateConversation(
  conversationId: string,
  title: string
): Promise<Conversation> {
  const response = await apiClient.patch<{ conversation: Conversation }>(
    `/chat/conversations/${conversationId}`,
    { title }
  );
  return response.data.conversation;
}

export async function deleteConversation(conversationId: string): Promise<void> {
  await apiClient.delete(`/chat/conversations/${conversationId}`);
}
