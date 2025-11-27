import { Router } from 'express';
import { conversationController } from '../controllers/conversationController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/conversations', authMiddleware, (req, res, next) => {
  void conversationController.listConversations(req, res, next);
});

router.get('/conversations/:id/messages', authMiddleware, (req, res, next) => {
  void conversationController.getConversationMessages(req, res, next);
});

router.post('/conversations/:id/rename', authMiddleware, (req, res, next) => {
  void conversationController.renameConversation(req, res, next);
});

router.delete('/conversations/:id', authMiddleware, (req, res, next) => {
  void conversationController.deleteConversation(req, res, next);
});

export default router;
