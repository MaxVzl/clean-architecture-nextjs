import { EmailAuthNotifierService } from "@/core/infrastructure/auth/services/email-auth-notifier.service";
import { InMemoryEmailService } from "@/core/infrastructure/common/services/email/in-memory-email.service";
import { db } from "@/core/infrastructure/database";
import { DrizzlePostsReadModel } from "@/core/infrastructure/post/read-models/drizzle-posts.read-model";
import { DrizzlePostsRepository } from "@/core/infrastructure/post/repositories/drizzle-posts.repository";
import { EmailPostNotifierService } from "@/core/infrastructure/post/services/email-post-notifier.service";
import { DrizzleUsersReadModel } from "@/core/infrastructure/user/read-models/drizzle-users.read-model";
import { DrizzleUsersRepository } from "@/core/infrastructure/user/repositories/drizzle-users.repository";

import { createContainer } from "./container";

const emailService = new InMemoryEmailService();

export const devContainer = createContainer({
  usersRepository: new DrizzleUsersRepository({ db }),
  postsRepository: new DrizzlePostsRepository({ db }),
  usersReadModel: new DrizzleUsersReadModel({ db }),
  postsReadModel: new DrizzlePostsReadModel({ db }),
  postNotifierService: new EmailPostNotifierService({ emailService }),
  authNotifierService: new EmailAuthNotifierService({ emailService }),
});
