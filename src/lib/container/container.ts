import {
  createUsersModule,
  UsersModuleDeps,
} from "@/lib/container/modules/users.module";
import {
  createPostsModule,
  PostsModuleDeps,
} from "@/lib/container/modules/posts.module";
import {
  AuthModuleDeps,
  createAuthModule,
} from "@/lib/container/modules/auth.module";

type ContainerDeps = AuthModuleDeps & UsersModuleDeps & PostsModuleDeps;

export function createContainer(deps: ContainerDeps) {
  return {
    ...createAuthModule(deps),
    ...createUsersModule(deps),
    ...createPostsModule(deps),
  };
}

export type Container = ReturnType<typeof createContainer>;
