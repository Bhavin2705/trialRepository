import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth';
import { UploadsController } from './uploads.controller';
import { UploadsValidator } from './uploads.validator';

const router = Router();

router.use(authenticate);

router.post('/avatar', UploadsValidator.uploadAvatar, UploadsController.uploadAvatar);
router.post('/recording', UploadsValidator.uploadRecording, UploadsController.uploadRecording);
router.delete('/file/:fileId', UploadsController.deleteFile);
router.get('/file/:fileId', UploadsController.getFile);

export default router;