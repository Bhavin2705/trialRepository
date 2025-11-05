import { NextFunction, Request, Response } from 'express';

export class SessionsValidator {
    static createSession = [
        SessionsValidator.handleValidationErrors
    ];

    static updateSession = [
        SessionsValidator.handleValidationErrors
    ];

    static handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
        next();
    }
}

export default SessionsValidator;