import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../core/env';

export function generateToken(payload: any): string {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRE
    } as SignOptions);
}

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export function generateRefreshToken(payload: any): string {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: '7d'
    } as SignOptions);
}

export function verifyRefreshToken(token: string): any {
    try {
        return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}