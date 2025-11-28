import { apiClient } from '../../../lib/apiClient';
import type { Message, Conversation } from '../../../types';

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

export async function* sendMessageStreaming(
  request: SendMessageRequest,
  onChunk?: (chunk: string) => void
): AsyncGenerator<
  | { type: 'metadata'; conversationId: string; userMessage: Message }
  | { type: 'chunk'; text: string }
  | { type: 'done'; assistantMessage: Message }
  | { type: 'error'; message: string },
  void,
  unknown
> {
  const baseURL = apiClient.defaults.baseURL || '';
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${baseURL}/chat/messages/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          if (data === '[DONE]') {
            return;
          }

          try {
            const event = JSON.parse(data);

            if (event.type === 'metadata') {
              yield {
                type: 'metadata',
                conversationId: event.data.conversationId,
                userMessage: event.data.userMessage,
              };
            } else if (event.type === 'chunk') {
              const chunk = event.data;
              if (onChunk) onChunk(chunk);
              yield {
                type: 'chunk',
                text: chunk,
              };
            } else if (event.type === 'done') {
              yield {
                type: 'done',
                assistantMessage: event.data.assistantMessage,
              };
            } else if (event.type === 'error') {
              yield {
                type: 'error',
                message: event.data.message,
              };
            }
          } catch (err) {
            console.error('Error parsing SSE data:', err);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
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
