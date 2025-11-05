import { NextFunction, Request, Response } from 'express';

export class UsersValidator {
    static updateProfile = [
        UsersValidator.handleValidationErrors
    ];

    static changePassword = [
        UsersValidator.handleValidationErrors
    ];

    static handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
        next();
    }
}

export default UsersValidator;