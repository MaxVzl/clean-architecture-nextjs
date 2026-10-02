import Redis, { type RedisOptions } from "ioredis";

import type { CacheService } from "@/core2/application/common/services/cache.service";

export type RedisCacheServiceDeps = {
  options: RedisOptions | string;
};

export const makeRedisCacheService = (
  deps: RedisCacheServiceDeps,
): CacheService => {
  const client =
    typeof deps.options === "string"
      ? new Redis(deps.options)
      : new Redis(deps.options);

  const get = async <T>(key: string): Promise<T | null> => {
    const data = await client.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  };

  const set = async (
    key: string,
    value: unknown,
    ttl: number,
  ): Promise<void> => {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await client.set(key, serialized, "EX", ttl);
    } else {
      await client.set(key, serialized);
    }
  };

  return {
    get,
    set,
    del: async (key: string): Promise<void> => {
      await client.del(key);
    },
    getOrSet: async <T>(
      key: string,
      factory: () => Promise<T>,
      ttl: number,
    ): Promise<T> => {
      const cached = await get<T>(key);
      if (cached !== null) return cached;
      const value = await factory();
      await set(key, value, ttl);
      return value;
    },
  };
};
