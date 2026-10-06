import { EmailAuthNotifierService } from "@/core/infrastructure/auth/services/email-auth-notifier.service";
import { InMemoryEmailService } from "@/core/infrastructure/common/services/email/in-memory-email.service";
import { db } from "@/core/infrastructure/database";
import { DrizzlePostReadModel } from "@/core/infrastructure/post/read-models/drizzle-post.read-model";
import { DrizzlePostRepository } from "@/core/infrastructure/post/repositories/drizzle-post.repository";
import { EmailPostNotifierService } from "@/core/infrastructure/post/services/email-post-notifier.service";
import { DrizzleUserReadModel } from "@/core/infrastructure/user/read-models/drizzle-user.read-model";
import { DrizzleUserRepository } from "@/core/infrastructure/user/repositories/drizzle-user.repository";

import { createContainer } from "./container";

const emailService = new InMemoryEmailService();

export const prodContainer = createContainer({
  userRepository: new DrizzleUserRepository({ db }),
  postRepository: new DrizzlePostRepository({ db }),
  userReadModel: new DrizzleUserReadModel({ db }),
  postReadModel: new DrizzlePostReadModel({ db }),
  postNotifierService: new EmailPostNotifierService({ emailService }),
  authNotifierService: new EmailAuthNotifierService({ emailService }),
});
