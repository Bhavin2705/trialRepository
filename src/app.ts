import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import path from 'path';
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

    this.app.use(cookieParser());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Serve uploads (Render-friendly absolute path)
    this.app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private setupRoutes(): void {
    // ✅ Root route — fixes "Route / not found"
    this.app.get('/', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Interview Mirror API is running successfully!',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV
      });
    });

    // Health check (useful for Render uptime)
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV
      });
    });

    // Main API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', usersRoutes);
    this.app.use('/api/sessions', sessionsRoutes);
    this.app.use('/api/uploads', uploadsRoutes);

    // 404 fallback
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      let err = { ...error };
      err.message = error.message;

      logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      if (err.name === 'CastError') err = new AppError('Resource not found', 404);
      if (err.code === 11000) err = new AppError('Duplicate field value entered', 400);
      if (err.name === 'ValidationError')
        err = new AppError(Object.values(err.errors || {}).map((v: any) => v.message).join(', '), 400);
      if (err.name === 'JsonWebTokenError') err = new AppError('Invalid token', 401);
      if (err.name === 'TokenExpiredError') err = new AppError('Token expired', 401);

      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(env.NODE_ENV === 'development' && { stack: err.stack, error: err })
      });
    });
  }
}

export default new App().app;
