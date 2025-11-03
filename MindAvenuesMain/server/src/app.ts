//src/app.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import connectDB from './utils/db';
import errorMiddleware, { BadRequestError } from './middleware/error';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { checkRedisHealth } from './config/redisClient';
import routes from './routes';
import reminderEmailMiddleware from './middleware/reminderEmailMiddleware'; // Import the new middleware
import cron from 'node-cron'; // Import cron directly here

dotenv.config();

const app: Express = express();

// Validate environment variables
const requiredEnvVars = ['MONGO_URI', 'PORT', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_FROM'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

app.set('trust proxy', 1); // For Azure load balancers
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false, // Relax CSP in dev
}));
app.use(mongoSanitize());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: 'Too many requests, please try again later',
});
app.use(limiter);

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? JSON.parse(process.env.FRONTEND_URL)
  : ['http://localhost:3000', 'https://salmon-tree-0c1a96f1e.6.azurestaticapps.net'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new BadRequestError('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/health', async (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  const redisStatus = await checkRedisHealth() ? 'Connected' : 'Disconnected';
  res.status(200).json({
    status: 'OK',
    database: dbStatus,
    redis: redisStatus,
  });
});

// Connect to MongoDB
connectDB();

//console.log('Applying reminder email middleware'); // Add this
//app.use(reminderEmailMiddleware);
//console.log('Reminder email middleware applied'); // Add this

// Temporary cron for testing
console.log('Scheduling cron directly');
const reminderTime = process.env.REMINDER_TIME || '0 * * * * *';
console.log('Cron schedule:', reminderTime);
try {
  cron.schedule(reminderTime, () => {
    console.log('Direct cron triggered at:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  }, {
    timezone: 'Asia/Kolkata'
  });
  console.log('Cron scheduled successfully');
} catch (error) {
  console.error('Error scheduling cron:', error);
}

// Routes
app.use('/api', routes);

// 404 handler
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new BadRequestError(`Cannot find ${req.originalUrl} on this server`));
});

// Error handling
app.use(errorMiddleware);

export default app;