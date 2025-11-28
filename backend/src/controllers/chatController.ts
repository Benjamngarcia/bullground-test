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

  async postMessageStreaming(req: Request, res: Response, _next: NextFunction): Promise<void> {
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

      // Set headers for Server-Sent Events
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering in nginx

      // Stream the response
      for await (const event of chatService.sendMessageStreaming({
        userId: req.userId,
        conversationId,
        message,
      })) {
        // Send SSE formatted data
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      }

      // End the stream
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      // For streaming errors, send error event and close
      if (error instanceof ApiError) {
        res.write(
          `data: ${JSON.stringify({ type: 'error', data: { message: error.message, code: error.code } })}\n\n`
        );
      } else {
        res.write(
          `data: ${JSON.stringify({ type: 'error', data: { message: 'Internal server error' } })}\n\n`
        );
      }
      res.end();
    }
  }
}

export const chatController = new ChatController();
