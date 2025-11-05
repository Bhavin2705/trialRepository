import { Request, Response } from 'express';
import { UsersService } from './users.service';

export class UsersController {
    static async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.id;
            const result = await UsersService.getUserProfile(userId);

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
                data: { user: result.user }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.id;
            const updateData = req.body;

            const result = await UsersService.updateUserProfile(userId, updateData);

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
                data: { user: result.user }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.id;
            const { currentPassword, newPassword } = req.body;

            const result = await UsersService.changePassword(userId, currentPassword, newPassword);

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

    static async deleteAccount(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.id;

            const result = await UsersService.deleteUser(userId);

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

    static async uploadAvatar(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.id;
            const file = (req as any).file;

            const result = await UsersService.uploadAvatar(userId, file);

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
                data: { avatarUrl: result.avatarUrl }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

export default UsersController;