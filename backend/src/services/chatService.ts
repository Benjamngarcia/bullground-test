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

    const recentMessages = await messageRepository.listRecentMessages(finalConversationId, 20);

    const llmResponse = await llmService.generateReply({
      messages: recentMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const assistantMessage = await messageRepository.createMessage({
      conversationId: finalConversationId,
      role: 'assistant',
      content: llmResponse.content,
    });

    await conversationRepository.updateConversationTimestamp(finalConversationId);

    const response: SendMessageResponse = {
      conversationId: finalConversationId,
      userMessage,
      assistantMessage,
    };

    if (isNewConversation || recentMessages.length <= 10) {
      const allMessages = await messageRepository.listMessages(finalConversationId);
      response.messages = allMessages;
    }

    return response;
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
