import { supabase } from './supabaseClient';
import { Conversation, NewConversation, PaginationParams, ApiError } from '../types/domain';

export class ConversationRepository {
  private tableName = 'conversations';

  async createConversation(data: NewConversation): Promise<Conversation> {
    const { data: conversation, error } = await supabase
      .from(this.tableName)
      .insert({
        user_id: data.userId,
        title: data.title,
      })
      .select()
      .single();

    if (error) {
      throw new ApiError(500, `Failed to create conversation: ${error.message}`, 'DB_ERROR');
    }

    return this.mapToConversation(conversation);
  }

  async listConversations(
    userId: string,
    pagination: PaginationParams = {}
  ): Promise<Conversation[]> {
    const { limit = 20, offset = 0 } = pagination;

    const { data: conversations, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new ApiError(500, `Failed to list conversations: ${error.message}`, 'DB_ERROR');
    }

    return (conversations || []).map(this.mapToConversation);
  }

  async countConversations(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('deleted', false);

    if (error) {
      throw new ApiError(500, `Failed to count conversations: ${error.message}`, 'DB_ERROR');
    }

    return count || 0;
  }

  async getConversationById(id: string, userId: string): Promise<Conversation | null> {
    const { data: conversation, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .eq('deleted', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new ApiError(500, `Failed to get conversation: ${error.message}`, 'DB_ERROR');
    }

    return this.mapToConversation(conversation);
  }

  async renameConversation(id: string, userId: string, title: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new ApiError(500, `Failed to rename conversation: ${error.message}`, 'DB_ERROR');
    }
  }

  async deleteConversation(id: string, userId: string): Promise<void> {
    // Soft delete: set deleted flag to true instead of actually deleting
    const { error } = await supabase
      .from(this.tableName)
      .update({ deleted: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new ApiError(500, `Failed to delete conversation: ${error.message}`, 'DB_ERROR');
    }
  }

  async updateConversationTimestamp(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new ApiError(
        500,
        `Failed to update conversation timestamp: ${error.message}`,
        'DB_ERROR'
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToConversation(data: any): Conversation {
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}

export const conversationRepository = new ConversationRepository();
