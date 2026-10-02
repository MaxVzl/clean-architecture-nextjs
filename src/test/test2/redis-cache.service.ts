import Redis from "ioredis";

import { CacheService } from "./cache.service";
import { createService } from "./config";

type RedisCacheServiceDeps = {
  url: string;
};

type RedisCacheServiceProps = {
  redis: Redis;
};

export const makeRedisCacheService = createService<
  CacheService,
  RedisCacheServiceDeps,
  RedisCacheServiceProps
>({
  constructor: ({ url }) => ({
    redis: new Redis(url),
  }),
  services: ({ url }, { redis }) => ({
    get: async (key: string) => {
      const value = await redis.get(key);
      if (!value) {
        throw new Error(`Key ${key} not found with redis url ${url}`);
      }
      return value;
    },
    set: async (key: string, value: string) => {
      await redis.set(key, value);
    },
    delete: async (key: string) => {
      await redis.del(key);
    },
  }),
});
