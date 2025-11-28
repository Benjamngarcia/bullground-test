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

/**
 * Send a message with streaming response
 * POST /chat/messages/stream
 * Returns an async generator that yields response events
 *
 * Note: React Native doesn't support ReadableStream API, so we use XMLHttpRequest
 */
export async function* sendMessageStreaming(
  request: SendMessageRequest
): AsyncGenerator<
  | { type: 'metadata'; conversationId: string; userMessage: Message }
  | { type: 'chunk'; text: string }
  | { type: 'done'; assistantMessage: Message }
  | { type: 'error'; message: string },
  void,
  unknown
> {
  const token = await apiClient.getToken();
  const baseURL = apiClient.axios.defaults.baseURL || '';

  const xhr = new XMLHttpRequest();
  let buffer = '';
  let lastProcessedIndex = 0;
  let isComplete = false;
  let hasError = false;

  const events: any[] = [];
  let resolveNext: ((value: IteratorResult<any>) => void) | null = null;

  const processBuffer = () => {
    const newData = buffer.slice(lastProcessedIndex);
    if (!newData) return;

    lastProcessedIndex = buffer.length;
    const lines = newData.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();

        if (data === '[DONE]') {
          console.log('[Streaming] Received [DONE]');
          isComplete = true;
          if (resolveNext) {
            resolveNext({ done: true, value: undefined });
            resolveNext = null;
          }
          return;
        }

        if (!data) continue; // Skip empty data

        try {
          const event = JSON.parse(data);
          let parsedEvent: any = null;

          if (event.type === 'metadata') {
            console.log('[Streaming] Metadata event:', event.data.conversationId);
            parsedEvent = {
              type: 'metadata',
              conversationId: event.data.conversationId,
              userMessage: {
                ...event.data.userMessage,
                createdAt: new Date(event.data.userMessage.createdAt),
              },
            };
          } else if (event.type === 'chunk') {
            console.log('[Streaming] Chunk:', event.data.substring(0, 20));
            parsedEvent = {
              type: 'chunk',
              text: event.data,
            };
          } else if (event.type === 'done') {
            console.log('[Streaming] Done event');
            parsedEvent = {
              type: 'done',
              assistantMessage: {
                ...event.data.assistantMessage,
                createdAt: new Date(event.data.assistantMessage.createdAt),
              },
            };
          } else if (event.type === 'error') {
            console.log('[Streaming] Error event:', event.data.message);
            parsedEvent = {
              type: 'error',
              message: event.data.message,
            };
          }

          if (parsedEvent) {
            if (resolveNext) {
              console.log('[Streaming] Resolving next with event');
              resolveNext({ done: false, value: parsedEvent });
              resolveNext = null;
            } else {
              console.log('[Streaming] Queuing event');
              events.push(parsedEvent);
            }
          }
        } catch (err) {
          console.error('[Streaming] Error parsing SSE data:', err, 'Data:', data);
        }
      }
    }
  };

  xhr.onprogress = () => {
    buffer = xhr.responseText;
    processBuffer();
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      buffer = xhr.responseText;
      processBuffer();
      isComplete = true;
      if (resolveNext) {
        resolveNext({ done: true, value: undefined });
        resolveNext = null;
      }
    } else {
      hasError = true;
      const errorEvent = {
        type: 'error',
        message: `HTTP error! status: ${xhr.status}`,
      };
      if (resolveNext) {
        resolveNext({ done: false, value: errorEvent });
        resolveNext = null;
      } else {
        events.push(errorEvent);
      }
    }
  };

  xhr.onerror = () => {
    hasError = true;
    const errorEvent = {
      type: 'error',
      message: 'Network error',
    };
    if (resolveNext) {
      resolveNext({ done: false, value: errorEvent });
      resolveNext = null;
    } else {
      events.push(errorEvent);
    }
  };

  console.log('[Streaming] Starting request to:', `${baseURL}/chat/messages/stream`);
  console.log('[Streaming] Request:', request);

  xhr.open('POST', `${baseURL}/chat/messages/stream`);
  xhr.setRequestHeader('Content-Type', 'application/json');
  if (token) {
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
  }
  xhr.send(JSON.stringify(request));

  console.log('[Streaming] Request sent, waiting for events...');

  // Generator loop
  while (!isComplete && !hasError) {
    if (events.length > 0) {
      yield events.shift()!;
    } else {
      // Wait for next event
      const result = await new Promise<IteratorResult<any>>((resolve) => {
        resolveNext = resolve;
      });

      if (result.done) {
        break;
      }

      if (result.value) {
        yield result.value;
      }
    }
  }

  // Yield any remaining events
  while (events.length > 0) {
    yield events.shift()!;
  }
}
