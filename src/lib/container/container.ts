import { AuthNotifierService } from "@/core/application/auth/services/auth-notifier.service";
import {
  createPostModule,
  PostModuleDeps,
} from "@/lib/container/modules/post.module";
import {
  createUserModule,
  UserModuleDeps,
} from "@/lib/container/modules/user.module";

type ContainerDeps = UserModuleDeps &
  PostModuleDeps & { authNotifierService: AuthNotifierService };

export const createContainer = (deps: ContainerDeps) => {
  return {
    ...createUserModule(deps),
    ...createPostModule(deps),
    authNotifierService: deps.authNotifierService,
  };
};

export type Container = ReturnType<typeof createContainer>;
