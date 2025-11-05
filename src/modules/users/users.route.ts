import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth';
import { UsersController } from './users.controller';
import { UsersValidator } from './users.validator';

const router = Router();

router.use(authenticate);

router.get('/profile', UsersController.getProfile);
router.put('/profile', UsersValidator.updateProfile, UsersController.updateProfile);
router.post('/change-password', UsersValidator.changePassword, UsersController.changePassword);
router.delete('/account', UsersController.deleteAccount);
router.post('/upload-avatar', UsersController.uploadAvatar);

export default router;