import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : req.cookies?.jwt;

        // Development-time debugging: log whether a token was provided
        // Use logger if available (require here to avoid circular imports).
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { logger } = require('../../core/logger');
            logger.debug('authenticate middleware: token present?', !!token);
        } catch (e) {
            // ignore logging failures
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token required'
            });
            return;
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
            return;
        }

        // Log decoded token for debugging in development
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { logger } = require('../../core/logger');
            logger.debug('authenticate middleware: decoded token', decoded);
        } catch (e) {
            // ignore
        }

        (req as any).user = { id: decoded.userId, email: decoded.email };
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};