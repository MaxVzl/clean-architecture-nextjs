import {
  createUserModule,
  UserModuleDeps,
} from "@/lib/container/modules/user.module";
import {
  createPostModule,
  PostModuleDeps,
} from "@/lib/container/modules/post.module";
import { AuthNotifierService } from "@/core/application/auth/services/auth-notifier.service";

type ContainerDeps = UserModuleDeps &
  PostModuleDeps & { authNotifierService: AuthNotifierService };

export function createContainer(deps: ContainerDeps) {
  return {
    ...createUserModule(deps),
    ...createPostModule(deps),
    authNotifierService: deps.authNotifierService,
  };
}

export type Container = ReturnType<typeof createContainer>;
