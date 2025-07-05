import mongoose from 'mongoose';
import { config } from '../index';
import { logger } from '../../utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database.url);
    logger.info('✅ Connected to MongoDB');
  } catch (error) {
    logger.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('✅ Disconnected from MongoDB');
  } catch (error) {
    logger.error('❌ Failed to disconnect from MongoDB:', error);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('🔄 MongoDB reconnected');
});

mongoose.connection.on('error', (error) => {
  logger.error('❌ MongoDB connection error:', error);
});

export default mongoose;