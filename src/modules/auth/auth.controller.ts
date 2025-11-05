import { Request, Response } from 'express';
import { env } from '../../core/env';
import { AuthService } from './auth.service';

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { email, password, displayName } = req.body;

            const result = await AuthService.registerUser({
                email,
                password,
                displayName
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: { user: result.user }
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const result = await AuthService.loginUser({ email, password });

            const cookieOptions = {
                expires: new Date(
                    Date.now() + env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict' as const
            };

            res.cookie('jwt', result.token, cookieOptions);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: result.user,
                    token: result.token
                }
            });
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    static async logout(req: Request, res: Response) {
        res.cookie('jwt', '', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    }

    static async verifyEmail(req: Request, res: Response) {
        try {
            const { token } = req.params;
            const result = await AuthService.verifyUserEmail(token);

            res.status(200).json({
                success: true,
                message: 'Email verified successfully',
                data: { user: result }
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            await AuthService.sendPasswordResetEmail(email);

            res.status(200).json({
                success: true,
                message: 'If the email exists, a password reset link has been sent'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async resetPassword(req: Request, res: Response) {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const result = await AuthService.resetUserPassword(token, password);

            const cookieOptions = {
                expires: new Date(
                    Date.now() + env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict' as const
            };

            res.cookie('jwt', result.token, cookieOptions);

            res.status(200).json({
                success: true,
                message: 'Password reset successful',
                data: {
                    user: result.user,
                    token: result.token
                }
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            const result = await AuthService.refreshUserToken(refreshToken);

            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: { token: result.token }
            });
        } catch (error: any) {
            const statusCode = error.message.includes('required') ? 400 : 401;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default AuthController;