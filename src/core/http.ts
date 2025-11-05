import compression from 'compression';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { env } from './env';
import { logger } from './logger';

export interface HttpServer {
    app: Express;
    start(): void;
    setupMiddleware(): void;
    setupRoutes(): void;
}

export class ExpressServer implements HttpServer {
    public app: Express;

    constructor() {
        this.app = express();
        this.setupMiddleware();
    }

    public setupMiddleware(): void {
        this.app.use(helmet());

        this.app.use(compression());

        this.app.use(cors({
            origin: env.ALLOWED_ORIGINS,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        }));

        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            logger.info(`${req.method} ${req.path} - ${req.ip}`);
            next();
        });
    }

    public setupRoutes(): void {
        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                environment: env.NODE_ENV
            });
        });

        this.app.use('*', (req: Request, res: Response) => {
            res.status(404).json({
                success: false,
                message: `Route ${req.originalUrl} not found`
            });
        });
    }

    public start(): void {
        this.app.listen(env.PORT, () => {
            logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
        });
    }
}

export const createServer = (): HttpServer => {
    return new ExpressServer();
};

export default createServer;