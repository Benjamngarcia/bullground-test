import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/messages', authMiddleware, (req, res, next) => {
  void chatController.postMessage(req, res, next);
});

router.post('/messages/stream', authMiddleware, (req, res, next) => {
  void chatController.postMessageStreaming(req, res, next);
});

export default router;
