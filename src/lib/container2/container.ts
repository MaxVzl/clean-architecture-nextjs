import { AuthNotifierService } from "@/core/application/auth/services/auth-notifier.service";
import { mergeModules } from "@/lib/container2/container.config";
import { postModule } from "@/lib/container2/modules/post.module";
import { userModule } from "@/lib/container2/modules/user.module";

export const createContainer = mergeModules([
  userModule,
  postModule,
  (deps: { authNotifierService: AuthNotifierService }) => ({
    authNotifierService: deps.authNotifierService,
  }),
]);
