import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { chatService } from '../services/chatService';
import { ApiError } from '../types/domain';
import { PostMessageRequest, PostMessageResponse } from '../types/api';

const postMessageSchema = z.object({
  conversationId: z.string().uuid().optional().nullable(),
  message: z.string().min(1).max(10000),
});

export class ChatController {
  async postMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new ApiError(401, 'User not authenticated', 'UNAUTHORIZED');
      }

      const validationResult = postMessageSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new ApiError(
          400,
          `Validation error: ${validationResult.error.errors.map((e) => e.message).join(', ')}`,
          'VALIDATION_ERROR'
        );
      }

      const { conversationId, message } = validationResult.data as PostMessageRequest;

      const result = await chatService.sendMessage({
        userId: req.userId,
        conversationId,
        message,
      });

      const response: PostMessageResponse = {
        conversationId: result.conversationId,
        userMessage: result.userMessage,
        assistantMessage: result.assistantMessage,
        messages: result.messages,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const chatController = new ChatController();
