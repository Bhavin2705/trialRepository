import dotenv from 'dotenv';

dotenv.config();

interface Environment {
    NODE_ENV: string;
    PORT: number;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRE: string;
    COOKIE_EXPIRE: number;
    EMAIL_FROM: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_EMAIL: string;
    SMTP_PASSWORD: string;
    OPENROUTER_API_KEY: string;
    OPENROUTER_BASE_URL: string;
    CLIENT_URL: string;
    ALLOWED_ORIGINS: string[];
    MAX_FILE_SIZE: number;
    UPLOAD_PATH: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
}

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'OPENROUTER_API_KEY'
];

const validateEnvironment = (): void => {
    const missing = requiredEnvVars.filter(
        (envVar) => !process.env[envVar]
    );

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}`
        );
    }
};

validateEnvironment();

export const env: Environment = {
    NODE_ENV: process.env['NODE_ENV'] || 'development',
    PORT: parseInt(process.env['PORT'] || '5000', 10),
    MONGODB_URI: process.env['MONGODB_URI']!,
    JWT_SECRET: process.env['JWT_SECRET']!,
    // use short-lived access tokens by default (15 minutes)
    JWT_EXPIRE: process.env['JWT_EXPIRE'] || '15m',
    COOKIE_EXPIRE: parseInt(process.env['COOKIE_EXPIRE'] || '30', 10),
    EMAIL_FROM: process.env['EMAIL_FROM'] || 'noreply@interviewmirror.com',
    SMTP_HOST: process.env['SMTP_HOST'] || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env['SMTP_PORT'] || '587', 10),
    SMTP_EMAIL: process.env['SMTP_EMAIL'] || '',
    SMTP_PASSWORD: process.env['SMTP_PASSWORD'] || '',
    OPENROUTER_API_KEY: process.env['OPENROUTER_API_KEY']!,
    OPENROUTER_BASE_URL: process.env['OPENROUTER_BASE_URL'] || 'https://openrouter.ai/api/v1',
    CLIENT_URL: process.env['CLIENT_URL'] || 'http://localhost:3000',
    ALLOWED_ORIGINS: process.env['ALLOWED_ORIGINS']?.split(',') || ['http://localhost:3000'],
    MAX_FILE_SIZE: parseInt(process.env['MAX_FILE_SIZE'] || '104857600', 10),
    UPLOAD_PATH: process.env['UPLOAD_PATH'] || './uploads',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10)
};

export default env;