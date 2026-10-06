import { EmailAuthNotifierService } from "@/core/infrastructure/auth/services/email-auth-notifier.service";
import { InMemoryEmailService } from "@/core/infrastructure/common/services/email/in-memory-email.service";
import { db } from "@/core/infrastructure/database";
import { DrizzlePostsQueryService } from "@/core/infrastructure/post/query-services/drizzle-posts-query.service";
import { DrizzlePostsRepository } from "@/core/infrastructure/post/repositories/drizzle-posts.repository";
import { EmailPostNotifierService } from "@/core/infrastructure/post/services/email-post-notifier.service";
import { DrizzleUsersQueryService } from "@/core/infrastructure/user/query-services/drizzle-users-query.service";
import { DrizzleUsersRepository } from "@/core/infrastructure/user/repositories/drizzle-users.repository";

import { createContainer } from "./container";

const emailService = new InMemoryEmailService();

export const prodContainer = createContainer({
  usersRepository: new DrizzleUsersRepository({ db }),
  postsRepository: new DrizzlePostsRepository({ db }),
  usersQueryService: new DrizzleUsersQueryService({ db }),
  postsQueryService: new DrizzlePostsQueryService({ db }),
  postNotifierService: new EmailPostNotifierService({ emailService }),
  authNotifierService: new EmailAuthNotifierService({ emailService }),
});
