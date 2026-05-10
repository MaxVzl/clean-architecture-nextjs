export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttl: number): Promise<void>;
  del(key: string): Promise<void>;
  getOrSet<T>(key: string, factory: () => Promise<T>, ttl: number): Promise<T>;
}
