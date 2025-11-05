import { generateToken, verifyToken } from '../../shared/utils/jwt';
import { comparePassword, hashPassword } from '../../shared/utils/password';
import AuthRepository from './auth.repo';

export class AuthService {
    static async registerUser(userData: any) {
        try {
            const existingUser = await AuthRepository.findUserByEmail(userData.email);
            if (existingUser) {
                throw new Error('User already exists with this email');
            }

            const hashedPassword = await hashPassword(userData.password);

            const user = await AuthRepository.createUser({
                email: userData.email,
                password: hashedPassword,
                displayName: userData.displayName
            });

            const token = generateToken({
                userId: user._id,
                email: user.email
            });

            return {
                user: {
                    id: user._id,
                    email: user.email,
                    displayName: user.displayName,
                    isEmailVerified: user.isEmailVerified
                },
                token
            };
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    }

    static async loginUser(loginData: any) {
        const user = await AuthRepository.findUserByEmail(loginData.email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await comparePassword(loginData.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const token = generateToken({
            userId: user._id,
            email: user.email
        });

        return {
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName,
                isEmailVerified: user.isEmailVerified
            },
            token
        };
    }

    static async verifyUserEmail(token: string) {
        const user = await AuthRepository.findUserByVerificationToken(token);
        if (!user) {
            throw new Error('Invalid or expired verification token');
        }

        await AuthRepository.verifyEmail(user._id as string);
        const updatedUser = await AuthRepository.findUserById(user._id as string);

        if (!updatedUser) {
            throw new Error('User not found after verification');
        }

        return {
            id: updatedUser._id,
            email: updatedUser.email,
            displayName: updatedUser.displayName,
            isEmailVerified: updatedUser.isEmailVerified
        };
    }

    static async sendPasswordResetEmail(email: string) {
        const user = await AuthRepository.findUserByEmail(email);
        if (!user) {
            return true;
        }

        const resetToken = await AuthRepository.setPasswordResetToken(user.email);
        return true;
    }

    static async resetUserPassword(token: string, password: string) {
        const user = await AuthRepository.findUserByResetToken(token);
        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
            throw new Error('Reset token has expired');
        }

        const hashedPassword = await hashPassword(password);
        await AuthRepository.updatePassword(user._id as string, hashedPassword);

        const updatedUser = await AuthRepository.findUserById(user._id as string);
        if (!updatedUser) {
            throw new Error('User not found after password reset');
        }

        const authToken = generateToken({
            userId: updatedUser._id,
            email: updatedUser.email
        });

        return {
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                displayName: updatedUser.displayName,
                isEmailVerified: updatedUser.isEmailVerified
            },
            token: authToken
        };
    }

    static async refreshUserToken(refreshToken: string) {
        if (!refreshToken) {
            throw new Error('Refresh token required');
        }

        const decoded = verifyToken(refreshToken);
        if (!decoded) {
            throw new Error('Invalid refresh token');
        }

        const user = await AuthRepository.findUserById(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }

        const newToken = generateToken({
            userId: user._id,
            email: user.email
        });

        return { token: newToken };
    }
}

export default AuthService;