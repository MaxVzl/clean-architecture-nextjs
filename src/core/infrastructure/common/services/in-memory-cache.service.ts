import type { CacheService } from "@/core/application/common/services/cache.service";

export class InMemoryCacheService implements CacheService {
  private cache = new Map<string, { value: unknown; expiry: number | null }>();

  get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return Promise.resolve(null);

    // Check expiry
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return Promise.resolve(null);
    }

    return Promise.resolve(item.value as T);
  }

  set(key: string, value: unknown, ttl: number): Promise<void> {
    const expiry = ttl ? Date.now() + ttl * 1000 : null;
    this.cache.set(key, { value, expiry });
    return Promise.resolve();
  }

  del(key: string): Promise<void> {
    this.cache.delete(key);
    return Promise.resolve();
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;
    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  // Test utility
  clear(): void {
    this.cache.clear();
  }
}
