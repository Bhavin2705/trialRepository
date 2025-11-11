import { Request, Response } from 'express';
import { env } from '../../core/env';
import { verifyRefreshToken } from '../../shared/utils/jwt';
import UsersRepository from '../users/users.repo';
import AuthRepository from './auth.repo';
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

            // set cookies for access & refresh tokens
            const accessCookieOptions = {
                expires: new Date(
                    Date.now() + env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                // allow cross-origin requests in development to send cookies
                sameSite: env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const
            };

            const refreshCookieOptions = {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const
            };

            if (result.token) res.cookie('jwt', result.token, accessCookieOptions);
            if ((result as any).refreshToken) res.cookie('refreshToken', (result as any).refreshToken, refreshCookieOptions);

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
                sameSite: env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const
            };

            res.cookie('jwt', result.token, cookieOptions);

            const refreshCookieOptions = {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const
            };

            if ((result as any).refreshToken) {
                res.cookie('refreshToken', (result as any).refreshToken, refreshCookieOptions);
            }

            // return user only; tokens are in cookies
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: result.user
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
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (refreshToken) {
                const decoded: any = verifyRefreshToken(refreshToken);
                if (decoded && decoded.userId) {
                    await AuthRepository.removeRefreshToken(decoded.userId, refreshToken);
                }
            }

            // clear cookies
            res.cookie('jwt', '', {
                expires: new Date(0),
                httpOnly: true
            });

            res.cookie('refreshToken', '', {
                expires: new Date(0),
                httpOnly: true
            });

            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: 'Error during logout' });
        }
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

            const accessCookieOptions = {
                expires: new Date(
                    Date.now() + env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const
            };

            const refreshCookieOptions = {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const
            };

            if (result.token) res.cookie('jwt', result.token, accessCookieOptions);
            if ((result as any).refreshToken) res.cookie('refreshToken', (result as any).refreshToken, refreshCookieOptions);

            res.status(200).json({
                success: true,
                message: 'Password reset successful',
                data: { user: result.user }
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
            const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
            const result = await AuthService.refreshUserToken(refreshToken);

            const accessCookieOptions = {
                expires: new Date(
                    Date.now() + env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict' as const
            };

            const refreshCookieOptions = {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict' as const
            };

            if (result.token) res.cookie('jwt', result.token, accessCookieOptions);
            if ((result as any).refreshToken) res.cookie('refreshToken', (result as any).refreshToken, refreshCookieOptions);

            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully'
            });
        } catch (error: any) {
            const statusCode = error.message.includes('required') ? 400 : 401;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    static async me(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { logger } = require('../../core/logger');
                logger.debug('AuthController.me called, userId:', userId);
            } catch (e) {
                // ignore
            }
            if (!userId) {
                const body: any = { success: false, message: 'Not authenticated' };
                if (env.NODE_ENV !== 'production') {
                    body.debug = { note: 'No userId available on request (authenticate likely did not find a token)' };
                }
                return res.status(401).json(body);
            }

            const user = await UsersRepository.findById(userId as string);
            if (!user) {
                const body: any = { success: false, message: 'User not found' };
                if (env.NODE_ENV !== 'production') {
                    body.debug = { missingUserId: userId };
                }
                return res.status(404).json(body);
            }

            return res.status(200).json({ success: true, data: { user } });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: 'Failed to fetch user' });
        }
    }
}

export default AuthController;