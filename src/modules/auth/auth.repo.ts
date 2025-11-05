import { IUser, User } from '../../shared/models/User';
import { generateResetToken, generateVerificationToken, hashPassword } from '../../shared/utils/password';

export class AuthRepository {
    static async findUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error('Error finding user by email');
        }
    }

    static async createUser(userData: {
        email: string;
        password: string;
        displayName: string;
    }): Promise<IUser> {
        try {
            const emailVerificationToken = generateVerificationToken();

            const user = new User({
                email: userData.email.toLowerCase(),
                password: userData.password, // Password is already hashed in the service
                displayName: userData.displayName,
                emailVerificationToken,
                isEmailVerified: false,
                refreshTokens: []
            });

            return await user.save();
        } catch (error: any) {
            if (error.code === 11000) {
                throw new Error('Email already exists');
            }
            throw new Error('Error creating user');
        }
    }

    static async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
        try {
            return await User.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new Error('Error updating user');
        }
    }

    static async findUserById(id: string): Promise<IUser | null> {
        try {
            return await User.findById(id);
        } catch (error) {
            throw new Error('Error finding user by ID');
        }
    }

    static async addRefreshToken(userId: string, refreshToken: string): Promise<void> {
        try {
            await User.findByIdAndUpdate(userId, {
                $push: { refreshTokens: refreshToken }
            });
        } catch (error) {
            throw new Error('Error adding refresh token');
        }
    }

    static async removeRefreshToken(userId: string, refreshToken: string): Promise<void> {
        try {
            await User.findByIdAndUpdate(userId, {
                $pull: { refreshTokens: refreshToken }
            });
        } catch (error) {
            throw new Error('Error removing refresh token');
        }
    }

    static async findUserByVerificationToken(token: string): Promise<IUser | null> {
        try {
            return await User.findOne({ emailVerificationToken: token });
        } catch (error) {
            throw new Error('Error finding user by verification token');
        }
    }

    static async findUserByResetToken(token: string): Promise<IUser | null> {
        try {
            return await User.findOne({
                passwordResetToken: token,
                passwordResetExpires: { $gt: new Date() }
            });
        } catch (error) {
            throw new Error('Error finding user by reset token');
        }
    }

    static async setPasswordResetToken(email: string): Promise<string> {
        try {
            const resetToken = generateResetToken();
            const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            await User.findOneAndUpdate(
                { email: email.toLowerCase() },
                {
                    passwordResetToken: resetToken,
                    passwordResetExpires: resetExpires
                }
            );

            return resetToken;
        } catch (error) {
            throw new Error('Error setting password reset token');
        }
    }

    static async updatePassword(userId: string, newPassword: string): Promise<void> {
        try {
            const hashedPassword = await hashPassword(newPassword);
            await User.findByIdAndUpdate(userId, {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null
            });
        } catch (error) {
            throw new Error('Error updating password');
        }
    }

    static async verifyEmail(userId: string): Promise<void> {
        try {
            await User.findByIdAndUpdate(userId, {
                isEmailVerified: true,
                emailVerificationToken: null
            });
        } catch (error) {
            throw new Error('Error verifying email');
        }
    }
}

export default AuthRepository;