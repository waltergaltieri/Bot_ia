
import { envs } from './envirioment/env-vars';

export const config = {
  // General
  nodeEnv: envs.NODE_ENV,
  port: envs.PORT,
  frontendUrl: 'http://localhost:3001', // No está en env-vars, valor por defecto

  // Database (placeholder for your database provider)
  database: {
    url: 'mongodb://localhost:27017/whatsapp_bot', // No está en env-vars, valor por defecto
  },

  // WhatsApp
  whatsapp: {
    token: envs.FACEBOOK_ACCESS_TOKEN, // Usando el token de Facebook/WhatsApp
    phoneNumberId: envs.WHATSAPP_PHONE_NUMBER_ID,
    webhookVerifyToken: envs.WHTASAPP_WEBHOOK_VERIFICATION_TOKEN,
    webhookSecret: '', // No está en env-vars
  },

  // OpenAI
  openai: {
    apiKey: envs.OPENAI_API_KEY,
    model: 'gpt-4-vision-preview', // No está en env-vars
  },

  // Telegram
  telegram: {
    botToken: envs.TELEGRAM_BOT_TOKEN,
    webhookUrl: envs.SERVER_TELEGRAM_WEBHOOK,
    baseUrl: envs.TELEGRAM_BASE_URL,
  },

  // Social Media
  socialMedia: {
    linkedin: {
      clientId: envs.LINKEDIN_CLIENT_ID,
      clientSecret: envs.LINKEDIN_CLIENT_SECRET,
      uniqueState: envs.LINKEDIN_UNIQUE_STATE,
    },
    instagram: {
      clientId: '', // No está en env-vars
      clientSecret: '', // No está en env-vars
    },
    tiktok: {
      clientId: '', // No está en env-vars
      clientSecret: '', // No está en env-vars
    },
  },

  // Redis
  redis: {
    url: 'redis://localhost:6379', // No está en env-vars
  },

  // JWT
  jwt: {
    secret: envs.JWT_SEED,
    expiresIn: '7d', // No está en env-vars
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 900000, // No está en env-vars
    maxRequests: 100, // No está en env-vars
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};