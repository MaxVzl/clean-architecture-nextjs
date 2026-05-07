import {
  createUsersModule,
  UsersModuleDeps,
} from "@/lib/container/modules/users.module";
import {
  createPostsModule,
  PostsModuleDeps,
} from "@/lib/container/modules/posts.module";

type ContainerDeps = UsersModuleDeps & PostsModuleDeps;

export function createContainer(deps: ContainerDeps) {
  return {
    ...createUsersModule(deps),
    ...createPostsModule(deps),
  };
}

export type Container = ReturnType<typeof createContainer>;
