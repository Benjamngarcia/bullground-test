import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', (req, res, next) => {
  void authController.signup(req, res, next);
});

router.post('/login', (req, res, next) => {
  void authController.login(req, res, next);
});

router.post('/refresh', (req, res, next) => {
  void authController.refresh(req, res, next);
});

router.post('/logout', authMiddleware, (req, res, next) => {
  void authController.logout(req, res, next);
});

router.get('/me', authMiddleware, (req, res, next) => {
  void authController.me(req, res, next);
});

export default router;
