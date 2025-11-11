import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth';
import { AuthController } from './auth.controller';
import { AuthValidator } from './auth.validator';

const router = Router();

router.post('/register', AuthValidator.register, AuthController.register);
router.post('/login', AuthValidator.login, AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/verify-email/:token', AuthController.verifyEmail);
router.post('/forgot-password', AuthValidator.forgotPassword, AuthController.forgotPassword);
router.post('/reset-password/:token', AuthValidator.resetPassword, AuthController.resetPassword);
router.post('/refresh-token', AuthController.refreshToken);
router.get('/me', authenticate, AuthController.me);

export default router;