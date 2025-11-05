import app from './app';
import { connectDatabase } from './core/db';
import { env } from './core/env';
import { logger } from './core/logger';

const startServer = async (): Promise<void> => {
    try {
        await connectDatabase();
        logger.info('✅ Database connected successfully');

        app.listen(env.PORT, () => {
            logger.info(`🚀 Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
            logger.info(`📱 Health check available at /health`);
        });

    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err: any) => {
    logger.error('🚨 Unhandled Promise Rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
    logger.error('🚨 Uncaught Exception:', err);
    process.exit(1);
});

process.on('SIGTERM', () => {
    logger.info('🛑 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('🛑 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

startServer();