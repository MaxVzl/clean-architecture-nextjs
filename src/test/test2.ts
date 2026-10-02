import Redis from "ioredis";
import { err, ok, Result } from "neverthrow";

// domain layer
type Error = {
  message: string;
};

// application layer
type CacheService = {
  get: (key: string) => Promise<Result<string, Error>>;
  set: (key: string, value: string) => Promise<void>;
  delete: (key: string) => Promise<void>;
};

// infrastructure layer
type RedisCacheServiceDeps = {
  url: string;
};

const makeRedisCacheService = ({
  url,
}: RedisCacheServiceDeps): CacheService => {
  const redis = new Redis(url);

  return {
    get: async (key: string) => {
      const value = await redis.get(key);
      if (!value) {
        return err({ message: `Key ${key} not found` });
      }
      return ok(value);
    },
    set: async (key: string, value: string) => {
      await redis.set(key, value);
    },
    delete: async (key: string) => {
      await redis.del(key);
    },
  };
};

const cacheService = makeRedisCacheService({ url: "redis://localhost:6379" });

cacheService.get("key").then((value) => {
  if (value.isErr()) {
    console.log(value.error);
  } else {
    console.log(value.value);
  }
});
