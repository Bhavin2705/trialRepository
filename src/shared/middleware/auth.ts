import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : req.cookies?.jwt;

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

        (req as any).user = { id: decoded.userId, email: decoded.email };
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};