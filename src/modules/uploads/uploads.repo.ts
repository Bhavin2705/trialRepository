import fs from 'fs';
import { FileUpload, IFileUpload } from '../../shared/models/FileUpload';

export class UploadsRepository {
    static async create(fileData: {
        userId: string;
        originalName: string;
        filename: string;
        path: string;
        mimetype: string;
        size: number;
        uploadType: 'avatar' | 'recording' | 'document';
        sessionId?: string;
    }): Promise<IFileUpload> {
        try {
            const fileUpload = new FileUpload({
                ...fileData,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return await fileUpload.save();
        } catch (error: any) {
            throw new Error('Error creating file upload record');
        }
    }

    static async findById(id: string): Promise<IFileUpload | null> {
        try {
            return await FileUpload.findById(id);
        } catch (error: any) {
            throw new Error('Error finding file upload by ID');
        }
    }

    static async findByUserId(userId: string): Promise<IFileUpload[]> {
        try {
            return await FileUpload.find({ userId }).sort({ createdAt: -1 });
        } catch (error: any) {
            throw new Error('Error finding file uploads by user ID');
        }
    }

    static async deleteById(id: string): Promise<boolean> {
        try {
            const fileUpload = await FileUpload.findById(id);
            if (!fileUpload) {
                return false;
            }

            try {
                if (fs.existsSync(fileUpload.path)) {
                    fs.unlinkSync(fileUpload.path);
                }
            } catch (fileError) {
                console.error('Error deleting physical file:', fileError);
            }

            const result = await FileUpload.findByIdAndDelete(id);
            return !!result;
        } catch (error: any) {
            throw new Error('Error deleting file upload');
        }
    }

    static async findByIdAndUserId(id: string, userId: string): Promise<IFileUpload | null> {
        try {
            return await FileUpload.findOne({ _id: id, userId });
        } catch (error: any) {
            throw new Error('Error finding file upload by ID and user ID');
        }
    }

    static async findBySessionId(sessionId: string): Promise<IFileUpload[]> {
        try {
            return await FileUpload.find({ sessionId }).sort({ createdAt: -1 });
        } catch (error: any) {
            throw new Error('Error finding file uploads by session ID');
        }
    }

    static async findByType(userId: string, uploadType: 'avatar' | 'recording' | 'document'): Promise<IFileUpload[]> {
        try {
            return await FileUpload.find({ userId, uploadType }).sort({ createdAt: -1 });
        } catch (error: any) {
            throw new Error('Error finding file uploads by type');
        }
    }

    static async updateSessionId(id: string, sessionId: string): Promise<IFileUpload | null> {
        try {
            return await FileUpload.findByIdAndUpdate(
                id,
                { sessionId, updatedAt: new Date() },
                { new: true }
            );
        } catch (error: any) {
            throw new Error('Error updating file upload session ID');
        }
    }
}

export default UploadsRepository;