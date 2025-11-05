import compression from 'compression';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import { env } from './core/env';
import { logger } from './core/logger';
import { AppError } from './shared/errors/AppError';

import authRoutes from './modules/auth/auth.route';
import sessionsRoutes from './modules/sessions/sessions.route';
import uploadsRoutes from './modules/uploads/uploads.route';
import usersRoutes from './modules/users/users.route';

class App {
    public app: Express;

    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    private setupMiddleware(): void {
        this.app.use(helmet());

        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: 'Too many requests from this IP, please try again later.'
        });
        this.app.use('/api/', limiter);

        this.app.use(mongoSanitize());
        this.app.use(hpp());
        this.app.use(compression());

        this.app.use(cors({
            origin: env.ALLOWED_ORIGINS,
            credentials: true
        }));

        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        this.app.use('/uploads', express.static('uploads'));

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            logger.info(`${req.method} ${req.path} - ${req.ip}`);
            next();
        });
    }

    private setupRoutes(): void {
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                environment: env.NODE_ENV
            });
        });

        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/users', usersRoutes);
        this.app.use('/api/sessions', sessionsRoutes);
        this.app.use('/api/uploads', uploadsRoutes);

        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                message: `Route ${req.originalUrl} not found`
            });
        });
    }

    private setupErrorHandling(): void {
        // Global error handler
        this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
            let err = { ...error };
            err.message = error.message;

            // Log error
            logger.error('Error:', {
                message: err.message,
                stack: err.stack,
                url: req.url,
                method: req.method,
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });

            // Mongoose bad ObjectId
            if (err.name === 'CastError') {
                const message = 'Resource not found';
                err = new AppError(message, 404);
            }

            // Mongoose duplicate key
            if (err.code === 11000) {
                const message = 'Duplicate field value entered';
                err = new AppError(message, 400);
            }

            // Mongoose validation error
            if (err.name === 'ValidationError') {
                const message = Object.values(err.errors || {}).map((val: any) => val.message).join(', ');
                err = new AppError(message, 400);
            }

            // JWT error
            if (err.name === 'JsonWebTokenError') {
                const message = 'Invalid token';
                err = new AppError(message, 401);
            }

            // JWT expired error
            if (err.name === 'TokenExpiredError') {
                const message = 'Token expired';
                err = new AppError(message, 401);
            }

            res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || 'Internal server error',
                ...(env.NODE_ENV === 'development' && {
                    stack: err.stack,
                    error: err
                })
            });
        });
    }
}

export default new App().app;