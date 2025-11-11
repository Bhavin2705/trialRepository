import { NextFunction, Request, Response } from 'express';

export class UploadsValidator {
    static uploadAvatar = [
        UploadsValidator.handleValidationErrors
    ];

    static uploadRecording = [
        UploadsValidator.handleValidationErrors
    ];

    static handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
        next();
    }
}

export default UploadsValidator;