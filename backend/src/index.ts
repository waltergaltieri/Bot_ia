import app from "./app";
import { config } from "./config";
import { MongoDatabase } from "./config/db";
import { logger } from "./utils/logger";

async function main() {
  const PORT = config.port || 3000;

  const server = app.listen(PORT, () => {
    logger.info(`🚀 Servidor corriendo en puerto ${PORT}`);
    logger.info(`📱 Entorno: ${config.nodeEnv}`);
    logger.info(`🔗 API disponible en: http://localhost:${PORT}/api`);
  });

  // Manejo graceful de shutdown
  process.on("SIGTERM", () => {
    logger.info("SIGTERM recibido. Cerrando servidor HTTP.");
    server.close(() => {
      logger.info("Proceso HTTP terminado.");
    });
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    process.exit(1);
  });
}

(async () => {
  await MongoDatabase.connect({
    dbName: config.database.dbName,
    mongoUrl: config.database.url,
  });
  main();
})();
