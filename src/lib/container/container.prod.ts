import { createContainer } from "./container";
import { DrizzleUsersRepository } from "@/core/infrastructure/users/repositories/drizzle-users.repository";
import { DrizzlePostsRepository } from "@/core/infrastructure/posts/repositories/drizzle-posts.repository";
import { DrizzleUsersQueryService } from "@/core/infrastructure/users/services/drizzle-users-query.service";
import { DrizzlePostsQueryService } from "@/core/infrastructure/posts/services/drizzle-posts-query.service";
import { InMemoryCacheService } from "@/core/infrastructure/common/services/in-memory-cache.service";
import { InMemoryEmailService } from "@/core/infrastructure/common/services/in-memory-email.service";
import { EmailPostNotifierService } from "@/core/infrastructure/posts/services/email-post-notifier.service";
import { EmailAuthNotifierService } from "@/core/infrastructure/auth/services/email-auth-notifier.service";

export const container = createContainer({
  usersRepository: new DrizzleUsersRepository(),
  postsRepository: new DrizzlePostsRepository(),
  usersQueryService: new DrizzleUsersQueryService(),
  postsQueryService: new DrizzlePostsQueryService(),
  cacheService: new InMemoryCacheService(),
  postNotifierService: new EmailPostNotifierService(new InMemoryEmailService()),
  authNotifierService: new EmailAuthNotifierService(new InMemoryEmailService()),
});
