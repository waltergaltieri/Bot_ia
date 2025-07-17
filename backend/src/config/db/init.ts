import mongoose from "mongoose";
import { logger } from "../../utils";

interface ConnectionOptions {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(options: ConnectionOptions) {
    const { mongoUrl, dbName } = options;

    try {
      await mongoose.connect(mongoUrl, {
        dbName: dbName,
      });

      logger.info("✅ Successfully connected to MongoDB!");

      return true;
    } catch (error) {
      logger.error("❌ Failed to connect to MongoDB:", error);
      throw error;
    }
  }
}
