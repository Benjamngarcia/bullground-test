import { supabase } from './supabaseClient';
import { Message, NewMessage, PaginationParams, ApiError } from '../types/domain';

export class MessageRepository {
  private tableName = 'messages';

  async createMessage(data: NewMessage): Promise<Message> {
    const { data: message, error } = await supabase
      .from(this.tableName)
      .insert({
        conversation_id: data.conversationId,
        role: data.role,
        content: data.content,
        metadata: data.metadata,
      })
      .select()
      .single();

    if (error) {
      throw new ApiError(500, `Failed to create message: ${error.message}`, 'DB_ERROR');
    }

    return this.mapToMessage(message);
  }

  async listMessages(
    conversationId: string,
    pagination: PaginationParams = {}
  ): Promise<Message[]> {
    const { limit = 50, offset = 0 } = pagination;

    const { data: messages, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new ApiError(500, `Failed to list messages: ${error.message}`, 'DB_ERROR');
    }

    return (messages || []).map(this.mapToMessage);
  }

  async countMessages(conversationId: string): Promise<number> {
    const { count, error } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId);

    if (error) {
      throw new ApiError(500, `Failed to count messages: ${error.message}`, 'DB_ERROR');
    }

    return count || 0;
  }

  async listRecentMessages(conversationId: string, limit: number = 20): Promise<Message[]> {
    const { data: messages, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new ApiError(500, `Failed to list recent messages: ${error.message}`, 'DB_ERROR');
    }

    return (messages || []).reverse().map(this.mapToMessage);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToMessage(data: any): Message {
    return {
      id: data.id,
      conversationId: data.conversation_id,
      role: data.role,
      content: data.content,
      createdAt: new Date(data.created_at),
      metadata: data.metadata,
    };
  }
}

export const messageRepository = new MessageRepository();
