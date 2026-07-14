import { EmailAuthNotifierService } from "@/core/infrastructure/auth/services/email-auth-notifier.service";
import { InMemoryCacheService } from "@/core/infrastructure/common/services/cache/in-memory-cache.service";
import { InMemoryEmailService } from "@/core/infrastructure/common/services/email/in-memory-email.service";
import { DrizzlePostsRepository } from "@/core/infrastructure/post/repositories/drizzle-posts.repository";
import { DrizzlePostsQueryService } from "@/core/infrastructure/post/services/drizzle-posts-query.service";
import { EmailPostNotifierService } from "@/core/infrastructure/post/services/email-post-notifier.service";
import { DrizzleUsersRepository } from "@/core/infrastructure/user/repositories/drizzle-users.repository";
import { DrizzleUsersQueryService } from "@/core/infrastructure/user/services/drizzle-users-query.service";

import { createContainer } from "./container";

const emailService = new InMemoryEmailService();

export const prodContainer = createContainer({
  usersRepository: new DrizzleUsersRepository(),
  postsRepository: new DrizzlePostsRepository(),
  usersQueryService: new DrizzleUsersQueryService(),
  postsQueryService: new DrizzlePostsQueryService(),
  postNotifierService: new EmailPostNotifierService({ emailService }),
  authNotifierService: new EmailAuthNotifierService({ emailService }),
});
