import { IUser, User } from '../../shared/models/User';

export class UsersRepository {
    static async findById(id: string): Promise<IUser | null> {
        try {
            return await User.findById(id).select('-password');
        } catch (error: any) {
            throw new Error('Error finding user by ID');
        }
    }

    static async updateById(id: string, data: Partial<IUser>): Promise<IUser | null> {
        try {
            return await User.findByIdAndUpdate(
                id,
                { ...data, updatedAt: new Date() },
                { new: true }
            ).select('-password');
        } catch (error: any) {
            throw new Error('Error updating user');
        }
    }

    static async deleteById(id: string): Promise<boolean> {
        try {
            const result = await User.findByIdAndDelete(id);
            return !!result;
        } catch (error: any) {
            throw new Error('Error deleting user');
        }
    }

    static async updatePassword(id: string, hashedPassword: string): Promise<boolean> {
        try {
            const result = await User.findByIdAndUpdate(
                id,
                { password: hashedPassword, updatedAt: new Date() }
            );
            return !!result;
        } catch (error: any) {
            throw new Error('Error updating password');
        }
    }

    static async updateProfile(id: string, profileData: {
        name?: string;
        bio?: string;
        avatar?: string;
        skills?: string[];
        experience?: string;
        company?: string;
        location?: string;
    }): Promise<IUser | null> {
        try {
            return await User.findByIdAndUpdate(
                id,
                {
                    ...profileData,
                    updatedAt: new Date()
                },
                { new: true }
            ).select('-password');
        } catch (error: any) {
            throw new Error('Error updating user profile');
        }
    }

    static async updateEmailVerification(id: string, isVerified: boolean): Promise<boolean> {
        try {
            const result = await User.findByIdAndUpdate(
                id,
                {
                    isEmailVerified: isVerified,
                    emailVerificationToken: undefined,
                    updatedAt: new Date()
                }
            );
            return !!result;
        } catch (error: any) {
            throw new Error('Error updating email verification');
        }
    }
}

export default UsersRepository;