import { PostsQueryService } from "@/core/application/post/services/posts-query.service";
import { UsersQueryService } from "@/core/application/user/services/users-query.service";
import { DrizzlePostsQueryService } from "@/core/infrastructure/post/services/drizzle-posts-query.service";
import { DrizzleUsersQueryService } from "@/core/infrastructure/user/services/drizzle-users-query.service";
import { UserController } from "@/core/presentation/controllers/user.controller";
import { createModule, mergeModules } from "@/lib/container3/container.config";

const userModule = createModule<{
  usersQueryService: UsersQueryService;
}>((deps) => ({
  controllers: {
    userController: new UserController({
      usersQueryService: deps.usersQueryService,
    }),
  },
}));

const createContainer = mergeModules([userModule]);

const result = createContainer({
  usersQueryService: new DrizzleUsersQueryService(),
});

console.log(result.controllers);
