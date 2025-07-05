import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // General
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',

  // Database (placeholder for your database provider)
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/whatsapp_bot',
  },

  // WhatsApp
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN!,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN!,
    webhookSecret: process.env.WHATSAPP_WEBHOOK_SECRET!,
  },

  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    model: process.env.OPENAI_MODEL || 'gpt-4-vision-preview',
  },

  // Social Media
  socialMedia: {
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    },
    instagram: {
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    },
    tiktok: {
      clientId: process.env.TIKTOK_CLIENT_ID!,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
    },
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validar variables de entorno críticas
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'OPENAI_API_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variable de entorno requerida: ${envVar}`);
  }
} 