//src/services/cache.service.ts
import redisClient from '../config/redisClient';

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await redisClient.setex(key, ttl, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
  }

  static async del(key: string): Promise<void> {
    await redisClient.del(key);
  }
}