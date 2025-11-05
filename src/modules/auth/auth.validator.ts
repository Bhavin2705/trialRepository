import { NextFunction, Request, Response } from 'express';

export class AuthValidator {
    static register = [
        AuthValidator.validateRegister,
        AuthValidator.handleValidationErrors
    ];

    static login = [
        AuthValidator.validateLogin,
        AuthValidator.handleValidationErrors
    ];

    static forgotPassword = [
        AuthValidator.validateEmail,
        AuthValidator.handleValidationErrors
    ];

    static resetPassword = [
        AuthValidator.validateResetPassword,
        AuthValidator.handleValidationErrors
    ];

    static validateRegister(req: Request, res: Response, next: NextFunction): void {
        const { email, password, displayName } = req.body;

        if (!email || !password || !displayName) {
            res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                message: 'Please enter a valid email'
            });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters'
            });
            return;
        }

        next();
    }

    static validateLogin(req: Request, res: Response, next: NextFunction): void {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
            return;
        }

        next();
    }

    static validateEmail(req: Request, res: Response, next: NextFunction): void {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required'
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                message: 'Please enter a valid email'
            });
            return;
        }

        next();
    }

    static validateResetPassword(req: Request, res: Response, next: NextFunction): void {
        const { password } = req.body;

        if (!password) {
            res.status(400).json({
                success: false,
                message: 'Password is required'
            });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters'
            });
            return;
        }

        next();
    }

    static handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
        next();
    }
}

export default AuthValidator;