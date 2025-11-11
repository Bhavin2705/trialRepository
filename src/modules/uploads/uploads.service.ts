import UploadsRepository from './uploads.repo';

export interface UploadResult {
    success: boolean;
    message: string;
    file?: any;
    error?: string;
}

export class UploadsService {
    static async uploadAvatar(userId: string, file: {
        originalname: string;
        filename: string;
        path: string;
        mimetype: string;
        size: number;
    }): Promise<UploadResult> {
        try {
            if (!file) {
                return {
                    success: false,
                    message: 'No file provided',
                    error: 'FILE_REQUIRED'
                };
            }

            const fileUpload = await UploadsRepository.create({
                userId,
                originalName: file.originalname,
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size,
                uploadType: 'avatar'
            });

            return {
                success: true,
                message: 'Avatar uploaded successfully',
                file: {
                    id: fileUpload._id,
                    filename: fileUpload.filename,
                    originalName: fileUpload.originalName,
                    path: fileUpload.path,
                    mimetype: fileUpload.mimetype,
                    size: fileUpload.size,
                    uploadType: fileUpload.uploadType,
                    createdAt: fileUpload.createdAt
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

    static async uploadRecording(userId: string, sessionId: string, file: {
        originalname: string;
        filename: string;
        path: string;
        mimetype: string;
        size: number;
    }): Promise<UploadResult> {
        try {
            if (!file) {
                return {
                    success: false,
                    message: 'No file provided',
                    error: 'FILE_REQUIRED'
                };
            }

            const fileUpload = await UploadsRepository.create({
                userId,
                originalName: file.originalname,
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size,
                uploadType: 'recording',
                sessionId
            });

            return {
                success: true,
                message: 'Recording uploaded successfully',
                file: {
                    id: fileUpload._id,
                    filename: fileUpload.filename,
                    originalName: fileUpload.originalName,
                    path: fileUpload.path,
                    mimetype: fileUpload.mimetype,
                    size: fileUpload.size,
                    uploadType: fileUpload.uploadType,
                    sessionId: fileUpload.sessionId,
                    createdAt: fileUpload.createdAt
                }
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Failed to upload recording',
                error: error.message
            };
        }
    }

    static async deleteFile(fileId: string, userId: string): Promise<UploadResult> {
        try {
            const file = await UploadsRepository.findByIdAndUserId(fileId, userId);
            if (!file) {
                return {
                    success: false,
                    message: 'File not found or access denied',
                    error: 'FILE_NOT_FOUND'
                };
            }

            const deleted = await UploadsRepository.deleteById(fileId);
            if (!deleted) {
                return {
                    success: false,
                    message: 'Failed to delete file',
                    error: 'DELETE_FAILED'
                };
            }

            return {
                success: true,
                message: 'File deleted successfully'
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Failed to delete file',
                error: error.message
            };
        }
    }

    static async getFile(fileId: string, userId: string): Promise<UploadResult> {
        try {
            const file = await UploadsRepository.findByIdAndUserId(fileId, userId);
            if (!file) {
                return {
                    success: false,
                    message: 'File not found or access denied',
                    error: 'FILE_NOT_FOUND'
                };
            }

            return {
                success: true,
                message: 'File retrieved successfully',
                file: {
                    id: file._id,
                    filename: file.filename,
                    originalName: file.originalName,
                    path: file.path,
                    mimetype: file.mimetype,
                    size: file.size,
                    uploadType: file.uploadType,
                    sessionId: file.sessionId,
                    createdAt: file.createdAt
                }
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Failed to retrieve file',
                error: error.message
            };
        }
    }

    static async getUserFiles(userId: string, uploadType?: 'avatar' | 'recording' | 'document'): Promise<UploadResult> {
        try {
            let files;
            if (uploadType) {
                files = await UploadsRepository.findByType(userId, uploadType);
            } else {
                files = await UploadsRepository.findByUserId(userId);
            }

            return {
                success: true,
                message: 'Files retrieved successfully',
                file: files.map(file => ({
                    id: file._id,
                    filename: file.filename,
                    originalName: file.originalName,
                    path: file.path,
                    mimetype: file.mimetype,
                    size: file.size,
                    uploadType: file.uploadType,
                    sessionId: file.sessionId,
                    createdAt: file.createdAt
                }))
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Failed to retrieve files',
                error: error.message
            };
        }
    }
}

export default UploadsService;