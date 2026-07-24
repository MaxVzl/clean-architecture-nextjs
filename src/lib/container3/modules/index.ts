import { AuthNotifierService } from "@/core/application/auth/services/auth-notifier.service";
import { createPostModule } from "@/lib/container3/modules/post.module";
import { createUserModule } from "@/lib/container3/modules/user.module";

export const modules = [
  createUserModule,
  createPostModule,
  (deps: { authNotifierService: AuthNotifierService }) => ({
    authNotifierService: deps.authNotifierService,
  }),
];
