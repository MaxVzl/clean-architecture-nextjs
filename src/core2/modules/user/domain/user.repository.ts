import { Context, Effect } from "effect";

import { User } from "@/core2/modules/user/domain/user.entity";

export class UserRepository extends Context.Service<
  UserRepository,
  {
    findById: () => Effect.Effect<User>;
    save: (user: User) => Effect.Effect<void>;
  }
>()("UserRepository") {}
