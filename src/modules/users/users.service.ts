import { comparePassword, hashPassword } from '../../shared/utils/password';
import AuthRepository from '../auth/auth.repo';
import UsersRepository from './users.repo';

export interface UserResult {
    success: boolean;
    message: string;
    user?: any;
    avatarUrl?: string;
    error?: string;
}

export class UsersService {
    static async getUserProfile(userId: string): Promise<UserResult> {
        try {
            const user = await UsersRepository.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                    error: 'USER_NOT_FOUND'
                };
            }

            return {
                success: true,
                message: 'Profile retrieved successfully',
                user: {
                    id: user._id,
                    email: user.email,
                    displayName: user.displayName,
                    avatar: user.avatar,
                    isEmailVerified: user.isEmailVerified,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Failed to retrieve profile',
                error: error.message
            };
        }
    }

    static async updateUserProfile(userId: string, updateData: {
        displayName?: string;
        avatar?: string;
    }): Promise<UserResult> {
        try {
            const updatedUser = await UsersRepository.updateById(userId, updateData);
            if (!updatedUser) {
                return {
                    success: false,
                    message: 'User not found',
                    error: 'USER_NOT_FOUND'
                };
            }

            return {
                success: true,
                message: 'Profile updated successfully',
                user: {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    displayName: updatedUser.displayName,
                    avatar: updatedUser.avatar,
                    isEmailVerified: updatedUser.isEmailVerified,
                    updatedAt: updatedUser.updatedAt
                }
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Failed to update profile',
                error: error.message
            };
        }
    }

    static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<UserResult> {
        try {
            const user = await AuthRepository.findUserById(userId);
            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                    error: 'USER_NOT_FOUND'
                };
            }

            const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return {
                    success: false,
                    message: 'Current password is incorrect',
                    error: 'INVALID_PASSWORD'
                };
            }

            const success = await UsersRepository.updatePassword(userId, await hashPassword(newPassword));
            if (!success) {
                return {
                    success: false,
                    message: 'Failed to update password',
                    error: 'UPDATE_FAILED'
                };
            }

            return {
                success: true,
                message: 'Password changed successfully'
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Failed to change password',
                error: error.message
            };
        }
    }

    static async deleteUser(userId: string): Promise<UserResult> {
        try {
            const deleted = await UsersRepository.deleteById(userId);
            if (!deleted) {
                return {
                    success: false,
                    message: 'User not found',
                    error: 'USER_NOT_FOUND'
                };
            }

            return {
                success: true,
                message: 'Account deleted successfully'
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Failed to delete account',
                error: error.message
            };
        }
    }

    static async uploadAvatar(userId: string, avatarPath: string): Promise<UserResult> {
        try {
            const updatedUser = await UsersRepository.updateById(userId, { avatar: avatarPath });
            if (!updatedUser) {
                return {
                    success: false,
                    message: 'User not found',
                    error: 'USER_NOT_FOUND'
                };
            }

            return {
                success: true,
                message: 'Avatar uploaded successfully',
                avatarUrl: avatarPath,
                user: {
                    id: updatedUser._id,
                    avatar: updatedUser.avatar
                }
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Failed to upload avatar',
                error: error.message
            };
        }
    }
}

export default UsersService;