import { conversationRepository } from '../infrastructure/conversationRepository';
import { messageRepository } from '../infrastructure/messageRepository';
import { llmService } from './llmService';
import { Message, ApiError } from '../types/domain';

interface SendMessageParams {
  userId: string;
  conversationId?: string;
  message: string;
}

interface SendMessageResponse {
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message;
  messages?: Message[];
}

export class ChatService {
  async sendMessage(params: SendMessageParams): Promise<SendMessageResponse> {
    const { userId, conversationId, message } = params;

    if (!message || message.trim().length === 0) {
      throw new ApiError(400, 'Message cannot be empty', 'INVALID_MESSAGE');
    }

    let finalConversationId: string;
    let isNewConversation = false;

    if (!conversationId) {
      const title = this.generateConversationTitle(message);
      const newConversation = await conversationRepository.createConversation({
        userId,
        title,
      });
      finalConversationId = newConversation.id;
      isNewConversation = true;
    } else {
      const conversation = await conversationRepository.getConversationById(conversationId, userId);
      if (!conversation) {
        throw new ApiError(404, 'Conversation not found', 'CONVERSATION_NOT_FOUND');
      }
      finalConversationId = conversationId;
    }

    const userMessage = await messageRepository.createMessage({
      conversationId: finalConversationId,
      role: 'user',
      content: message,
    });

    await conversationRepository.updateConversationTimestamp(finalConversationId);

    let assistantMessage: Message;

    try {
      const recentMessages = await messageRepository.listRecentMessages(finalConversationId, 20);

      const llmResponse = await llmService.generateReply({
        messages: recentMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      assistantMessage = await messageRepository.createMessage({
        conversationId: finalConversationId,
        role: 'assistant',
        content: llmResponse.content,
      });
    } catch (error) {
      console.error('LLM generation failed, but conversation and user message are saved:', error);
      assistantMessage = await messageRepository.createMessage({
        conversationId: finalConversationId,
        role: 'assistant',
        content: "Something went wrong, but don't worry! Would you like to try again?",
      });

      const errorMessage = error instanceof Error ? error.message : 'LLM generation failed';
      throw new ApiError(
        500,
        `Failed to generate response: ${errorMessage}. Your message was saved and you can retry later.`,
        'LLM_GENERATION_ERROR'
      );
    }

    const response: SendMessageResponse = {
      conversationId: finalConversationId,
      userMessage,
      assistantMessage,
    };

    if (
      isNewConversation ||
      (await messageRepository.listRecentMessages(finalConversationId, 10)).length <= 10
    ) {
      const allMessages = await messageRepository.listMessages(finalConversationId);
      response.messages = allMessages;
    }

    return response;
  }

  /**
   * Sends a message and streams the assistant's response in real-time.
   * Returns an async generator that yields response chunks.
   */
  async *sendMessageStreaming(
    params: SendMessageParams
  ): AsyncGenerator<
    | { type: 'metadata'; data: { conversationId: string; userMessage: Message } }
    | { type: 'chunk'; data: string }
    | { type: 'done'; data: { assistantMessage: Message } }
    | { type: 'error'; data: { message: string } },
    void,
    unknown
  > {
    const { userId, conversationId, message } = params;

    if (!message || message.trim().length === 0) {
      throw new ApiError(400, 'Message cannot be empty', 'INVALID_MESSAGE');
    }

    let finalConversationId: string;

    if (!conversationId) {
      const title = this.generateConversationTitle(message);
      const newConversation = await conversationRepository.createConversation({
        userId,
        title,
      });
      finalConversationId = newConversation.id;
    } else {
      const conversation = await conversationRepository.getConversationById(conversationId, userId);
      if (!conversation) {
        throw new ApiError(404, 'Conversation not found', 'CONVERSATION_NOT_FOUND');
      }
      finalConversationId = conversationId;
    }

    const userMessage = await messageRepository.createMessage({
      conversationId: finalConversationId,
      role: 'user',
      content: message,
    });

    await conversationRepository.updateConversationTimestamp(finalConversationId);

    yield {
      type: 'metadata',
      data: {
        conversationId: finalConversationId,
        userMessage,
      },
    };

    const recentMessages = await messageRepository.listRecentMessages(finalConversationId, 20);

    let fullResponse = '';
    try {
      for await (const chunk of llmService.generateStreamingReply({
        messages: recentMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      })) {
        fullResponse += chunk;
        yield {
          type: 'chunk',
          data: chunk,
        };
      }

      const assistantMessage = await messageRepository.createMessage({
        conversationId: finalConversationId,
        role: 'assistant',
        content: fullResponse,
      });

      yield {
        type: 'done',
        data: {
          assistantMessage,
        },
      };
    } catch (error) {
      console.error('Streaming LLM generation failed, but user message is saved:', error);

      const errorAssistantMessage = await messageRepository.createMessage({
        conversationId: finalConversationId,
        role: 'assistant',
        content: "Something went wrong, but don't worry! Would you like to try again?",
      });

      yield {
        type: 'error',
        data: {
          message:
            'Failed to generate streaming response. Your message was saved and you can retry later.',
        },
      };

      yield {
        type: 'done',
        data: {
          assistantMessage: errorAssistantMessage,
        },
      };
    }
  }

  private generateConversationTitle(message: string): string {
    const maxLength = 60;
    const cleaned = message.trim().replace(/\s+/g, ' ');

    if (cleaned.length <= maxLength) {
      return cleaned;
    }

    return cleaned.substring(0, maxLength - 3) + '...';
  }
}

export const chatService = new ChatService();
