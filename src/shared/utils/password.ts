import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

export function generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export function generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
    if (password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!/(?=.*[a-z])/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!/(?=.*\d)/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one number' };
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one special character' };
    }

    return { isValid: true };
}