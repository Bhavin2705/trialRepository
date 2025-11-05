import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth';
import { SessionsController } from './sessions.controller';
import { SessionsValidator } from './sessions.validator';

const router = Router();

router.use(authenticate);

router.post('/', SessionsValidator.createSession, SessionsController.createSession);
router.get('/', SessionsController.getSessions);
router.get('/:id', SessionsController.getSession);
router.put('/:id', SessionsValidator.updateSession, SessionsController.updateSession);
router.delete('/:id', SessionsController.deleteSession);
router.post('/:id/start', SessionsController.startSession);
router.post('/:id/end', SessionsController.endSession);
router.get('/:id/analysis', SessionsController.getAnalysis);

export default router;