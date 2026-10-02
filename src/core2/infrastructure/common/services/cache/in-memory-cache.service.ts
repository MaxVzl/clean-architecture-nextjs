import type { CacheService } from "@/core2/application/common/services/cache.service";

export type InMemoryCacheService = CacheService & {
  clear: () => void;
};

export const makeInMemoryCacheService = (): InMemoryCacheService => {
  const cache = new Map<string, { value: unknown; expiry: number | null }>();

  const get = async <T>(key: string): Promise<T | null> => {
    const item = cache.get(key);
    if (!item) return null;

    if (item.expiry && Date.now() > item.expiry) {
      cache.delete(key);
      return null;
    }

    return item.value as T;
  };

  const set = async (
    key: string,
    value: unknown,
    ttl: number,
  ): Promise<void> => {
    const expiry = ttl ? Date.now() + ttl * 1000 : null;
    cache.set(key, { value, expiry });
  };

  return {
    get,
    set,
    del: async (key: string): Promise<void> => {
      cache.delete(key);
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
    clear: () => {
      cache.clear();
    },
  };
};
