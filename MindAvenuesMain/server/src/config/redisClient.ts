import Redis from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

interface RedisConfig {
  host: string;
  port: number;
  password: string;
  tls: Record<string, any>;
  maxRetriesPerRequest: number | null;
  retryStrategy: (times: number) => number | null;
  connectTimeout: number;
  reconnectOnError: (err: Error) => boolean;
}

const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6380,
  password: process.env.REDIS_KEY || '',
  tls: process.env.REDIS_TLS === 'true' ? {} : {},
  maxRetriesPerRequest: null,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 5000);
    console.log(`Redis reconnection attempt ${times}, delay: ${delay}ms`);
    return delay;
  },
  connectTimeout: 20000,
  reconnectOnError: (err: Error) => {
    console.error('Redis reconnection error:', err);
    return true;
  },
};

const redisClient = new Redis(redisConfig);

redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('close', () => console.log('Redis connection closed'));

// Health check method
export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    await redisClient.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
};

export default redisClient;