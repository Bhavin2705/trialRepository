import { Request, Response } from 'express';
import { UploadsService } from './uploads.service';

export class UploadsController {
    static async uploadAvatar(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.id;
            const file = (req as any).file;

            const result = await UploadsService.uploadAvatar(userId, file);

            if (!result.success) {
                res.status(400).json({
                    success: false,
                    message: result.message
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: result.message,
                data: { file: result.file }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async uploadRecording(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.id;
            const file = (req as any).file;
            const { sessionId } = req.body;

            const result = await UploadsService.uploadRecording(userId, sessionId, file);

            if (!result.success) {
                res.status(400).json({
                    success: false,
                    message: result.message
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: result.message,
                data: { file: result.file }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async deleteFile(req: Request, res: Response): Promise<void> {
        try {
            const { fileId } = req.params;
            const userId = (req as any).user?.id;

            const result = await UploadsService.deleteFile(fileId, userId);

            if (!result.success) {
                res.status(400).json({
                    success: false,
                    message: result.message
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getFile(req: Request, res: Response): Promise<void> {
        try {
            const { fileId } = req.params;
            const userId = (req as any).user?.id;

            const result = await UploadsService.getFile(fileId, userId);

            if (!result.success) {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: result.message,
                data: { file: result.file }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

export default UploadsController;