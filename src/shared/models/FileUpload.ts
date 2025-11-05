import mongoose, { Document, Schema } from 'mongoose';

export interface IFileUpload extends Document {
    _id: string;
    userId: string;
    originalName: string;
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    uploadType: 'avatar' | 'recording' | 'document';
    sessionId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const FileUploadSchema = new Schema<IFileUpload>({
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    originalName: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true,
        unique: true
    },
    path: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    uploadType: {
        type: String,
        enum: ['avatar', 'recording', 'document'],
        required: true
    },
    sessionId: {
        type: String,
        ref: 'Session'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

FileUploadSchema.index({ userId: 1 });
FileUploadSchema.index({ sessionId: 1 });
FileUploadSchema.index({ uploadType: 1 });

export const FileUpload = mongoose.model<IFileUpload>('FileUpload', FileUploadSchema);