import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    displayName: string;
    avatar?: string;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    refreshTokens: string[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    avatar: {
        type: String,
        default: null
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshTokens: [String]
}, {
    timestamps: true
});

userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
export default User;