import { conversationRepository } from '../infrastructure/conversationRepository';
import { messageRepository } from '../infrastructure/messageRepository';
import { Conversation, Message, PaginationParams, ApiError } from '../types/domain';

export class ConversationService {
  async listConversations(
    userId: string,
    pagination: PaginationParams = {}
  ): Promise<{
    conversations: Conversation[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 20, offset = 0 } = pagination;

    const conversations = await conversationRepository.listConversations(userId, {
      limit,
      offset,
    });
    const total = await conversationRepository.countConversations(userId);

    return {
      conversations,
      total,
      limit,
      offset,
    };
  }

  async getConversationMessages(
    conversationId: string,
    userId: string,
    pagination: PaginationParams = {}
  ): Promise<{
    messages: Message[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { limit = 50, offset = 0 } = pagination;

    const conversation = await conversationRepository.getConversationById(conversationId, userId);
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found', 'CONVERSATION_NOT_FOUND');
    }

    const messages = await messageRepository.listMessages(conversationId, { limit, offset });
    const total = await messageRepository.countMessages(conversationId);

    return {
      messages,
      total,
      limit,
      offset,
    };
  }

  async renameConversation(
    conversationId: string,
    userId: string,
    title: string
  ): Promise<Conversation> {
    if (!title || title.trim().length === 0) {
      throw new ApiError(400, 'Title cannot be empty', 'INVALID_TITLE');
    }

    const conversation = await conversationRepository.getConversationById(conversationId, userId);
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found', 'CONVERSATION_NOT_FOUND');
    }

    await conversationRepository.renameConversation(conversationId, userId, title.trim());

    const updatedConversation = await conversationRepository.getConversationById(
      conversationId,
      userId
    );
    if (!updatedConversation) {
      throw new ApiError(500, 'Failed to retrieve updated conversation', 'DB_ERROR');
    }

    return updatedConversation;
  }

  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    const conversation = await conversationRepository.getConversationById(conversationId, userId);
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found', 'CONVERSATION_NOT_FOUND');
    }

    // Note: In production, you might want to implement soft deletes
    // or cascade delete messages. For this implementation, we rely on
    // Supabase's CASCADE DELETE constraint on the messages table.
    await conversationRepository.deleteConversation(conversationId, userId);
  }
}

export const conversationService = new ConversationService();
