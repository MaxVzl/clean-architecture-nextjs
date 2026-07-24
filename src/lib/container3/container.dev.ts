import { EmailAuthNotifierService } from "@/core/infrastructure/auth/services/email-auth-notifier.service";
import { InMemoryEmailService } from "@/core/infrastructure/common/services/email/in-memory-email.service";
import { db } from "@/core/infrastructure/database";
import { DrizzlePostsRepository } from "@/core/infrastructure/post/repositories/drizzle-posts.repository";
import { DrizzlePostsQueryService } from "@/core/infrastructure/post/services/drizzle-posts-query.service";
import { EmailPostNotifierService } from "@/core/infrastructure/post/services/email-post-notifier.service";
import { DrizzleUsersRepository } from "@/core/infrastructure/user/repositories/drizzle-users.repository";
import { DrizzleUsersQueryService } from "@/core/infrastructure/user/services/drizzle-users-query.service";
import { createContainer } from "@/lib/container3/container";
import { modules } from "@/lib/container3/modules";

const emailService = new InMemoryEmailService();

export const devContainer = createContainer(modules, {
  usersRepository: new DrizzleUsersRepository({ db }),
  postsRepository: new DrizzlePostsRepository({ db }),
  usersQueryService: new DrizzleUsersQueryService({ db }),
  postsQueryService: new DrizzlePostsQueryService({ db }),
  postNotifierService: new EmailPostNotifierService({ emailService }),
  authNotifierService: new EmailAuthNotifierService({ emailService }),
});
