import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

interface MongoOptions {
  retryWrites?: boolean;
  maxIdleTimeMS?: number;
  serverSelectionTimeoutMS?: number;
  socketTimeoutMS?: number;
  maxPoolSize?: number;
}

const connectDB = async (options: MongoOptions = {}) => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/damera2';

  const defaultOptions: MongoOptions = {
    retryWrites: false,
    maxIdleTimeMS: 120000,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10, // Connection pooling
    ...options,
  };

  try {
    await mongoose.connect(mongoUri, defaultOptions);
    console.log('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;