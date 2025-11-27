import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { conversationService } from '../services/conversationService';
import { ApiError } from '../types/domain';
import {
  ListConversationsResponse,
  GetMessagesResponse,
  RenameConversationRequest,
} from '../types/api';

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

const renameConversationSchema = z.object({
  title: z.string().min(1).max(200),
});

export class ConversationController {
  async listConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new ApiError(401, 'User not authenticated', 'UNAUTHORIZED');
      }

      const validationResult = paginationSchema.safeParse(req.query);
      if (!validationResult.success) {
        throw new ApiError(
          400,
          `Validation error: ${validationResult.error.errors.map((e) => e.message).join(', ')}`,
          'VALIDATION_ERROR'
        );
      }

      const { limit, offset } = validationResult.data;

      const result = await conversationService.listConversations(req.userId, { limit, offset });

      const response: ListConversationsResponse = {
        conversations: result.conversations,
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getConversationMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new ApiError(401, 'User not authenticated', 'UNAUTHORIZED');
      }

      const conversationId = req.params.id;

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(conversationId)) {
        throw new ApiError(400, 'Invalid conversation ID format', 'VALIDATION_ERROR');
      }

      const validationResult = paginationSchema.safeParse(req.query);
      if (!validationResult.success) {
        throw new ApiError(
          400,
          `Validation error: ${validationResult.error.errors.map((e) => e.message).join(', ')}`,
          'VALIDATION_ERROR'
        );
      }

      const { limit, offset } = validationResult.data;

      const result = await conversationService.getConversationMessages(conversationId, req.userId, {
        limit,
        offset,
      });

      const response: GetMessagesResponse = {
        messages: result.messages,
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async renameConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new ApiError(401, 'User not authenticated', 'UNAUTHORIZED');
      }

      const conversationId = req.params.id;

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(conversationId)) {
        throw new ApiError(400, 'Invalid conversation ID format', 'VALIDATION_ERROR');
      }

      const validationResult = renameConversationSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new ApiError(
          400,
          `Validation error: ${validationResult.error.errors.map((e) => e.message).join(', ')}`,
          'VALIDATION_ERROR'
        );
      }

      const { title } = validationResult.data as RenameConversationRequest;

      const conversation = await conversationService.renameConversation(
        conversationId,
        req.userId,
        title
      );

      res.status(200).json(conversation);
    } catch (error) {
      next(error);
    }
  }

  async deleteConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new ApiError(401, 'User not authenticated', 'UNAUTHORIZED');
      }

      const conversationId = req.params.id;

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(conversationId)) {
        throw new ApiError(400, 'Invalid conversation ID format', 'VALIDATION_ERROR');
      }

      await conversationService.deleteConversation(conversationId, req.userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const conversationController = new ConversationController();
