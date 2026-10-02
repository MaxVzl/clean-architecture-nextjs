import { makeRedisCacheService } from "@/test/test2/redis-cache.service";

const cacheService = makeRedisCacheService({ url: "redis://localhost:6379" });

cacheService.get("key").then((value) => {
  console.log(value);
});
