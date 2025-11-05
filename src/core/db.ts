import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

export const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(env.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });

        logger.info(`MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.info('MongoDB disconnected');
        });

        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                logger.info('MongoDB connection closed');
                process.exit(0);
            } catch (error) {
                logger.error('Error during database shutdown:', error);
                process.exit(1);
            }
        });

        process.on('SIGTERM', async () => {
            try {
                await mongoose.connection.close();
                logger.info('MongoDB connection closed');
                process.exit(0);
            } catch (error) {
                logger.error('Error during database shutdown:', error);
                process.exit(1);
            }
        });

    } catch (error) {
        logger.error('Database connection failed:', error);
        process.exit(1);
    }
};