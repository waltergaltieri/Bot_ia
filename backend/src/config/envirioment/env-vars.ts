import 'dotenv/config'
import  *  as  env from 'env-var' ;

export const envs = {
    // Node environment
    NODE_ENV: env.get('NODE_ENV').default('development').asString(),
    
    // Facebook/WhatsApp
    FACEBOOK_ACCESS_TOKEN: env.get('FACEBOOK_ACCESS_TOKEN').required().asString(),
    WHATSAPP_PHONE_NUMBER_ID: env.get('WHATSAPP_PHONE_NUMBER_ID').required().asString(),
    WHATSAPP_BUSINESS_ACCOUNT_ID: env.get('WHATSAPP_BUSINESS_ACCOUNT_ID').required().asString(),
    WHTASAPP_WEBHOOK_VERIFICATION_TOKEN: env.get('WHTASAPP_WEBHOOK_VERIFICATION_TOKEN').required().asString(),
    
    // Telegram
    TELEGRAM_BOT_TOKEN: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    SERVER_TELEGRAM_WEBHOOK: env.get('SERVER_TELEGRAM_WEBHOOK').required().asString(),
    TELEGRAM_BASE_URL: env.get('TELEGRAM_BASE_URL').required().asString(),
    
    // OpenAI
    OPENAI_API_KEY: env.get('OPENAI_API_KEY').required().asString(),
    
    // LinkedIn
    LINKEDIN_CLIENT_ID: env.get('LINKEDIN_CLIENT_ID').required().asString(),
    LINKEDIN_CLIENT_SECRET: env.get('LINKEDIN_CLIENT_SECRET').required().asString(),
    LINKEDIN_UNIQUE_STATE: env.get('LINKEDIN_UNIQUE_STATE').required().asString(),
    
    // Server configuration (common variables that might be needed)
    PORT: env.get('PORT').default(3000).asPortNumber(),
    JWT_SEED: env.get('JWT_SEED').asString(),
    
    // Helper methods
    isProduction: () => envs.NODE_ENV === 'production',
    isDevelopment: () => envs.NODE_ENV === 'development'
}