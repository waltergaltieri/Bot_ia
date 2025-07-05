import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middlewares/error-handler';
import { rateLimitMiddleware } from './middlewares/rate-limit';
import { connectDB } from './config/db/mongo-db';

// Importar rutas
import authRoutes from './routes/auth';
import companiesRoutes from './routes/companies';
import teamsRoutes from './routes/teams';
import usersRoutes from './routes/users';
import publicationsRoutes from './routes/publications';
import metricsRoutes from './routes/metrics';
import whatsappRoutes from './routes/whatsapp';

const app = express();

// Initialize database connection
connectDB();

// Middleware de seguridad
app.use(helmet());
app.use(compression());

// CORS
app.use(cors({
  origin: config.nodeEnv === 'production' 
    ? config.frontendUrl 
    : ['http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true,
}));

// Rate limiting
app.use(rateLimitMiddleware);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.originalUrl 
  });
});

// Error handler (debe ir al final)
app.use(errorHandler);

export default app; 