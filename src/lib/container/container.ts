import {
  createUsersModule,
  UsersModuleDeps,
} from "@/lib/container/modules/users.module";
import {
  createPostsModule,
  PostsModuleDeps,
} from "@/lib/container/modules/posts.module";
import { AuthNotifierService } from "@/core/application/auth/services/auth-notifier.service";

type ContainerDeps = UsersModuleDeps &
  PostsModuleDeps & { authNotifierService: AuthNotifierService };

export function createContainer(deps: ContainerDeps) {
  return {
    ...createUsersModule(deps),
    ...createPostsModule(deps),
    authNotifierService: deps.authNotifierService,
  };
}

export type Container = ReturnType<typeof createContainer>;
