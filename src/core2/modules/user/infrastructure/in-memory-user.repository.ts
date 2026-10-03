import { Effect, Layer } from "effect";

import { User } from "@/core2/modules/user/domain/user.entity";
import { UserRepository } from "@/core2/modules/user/domain/user.repository";
import { Money } from "@/core2/modules/user/domain/value-objects/money.vo";
import { UserId } from "@/core2/modules/user/domain/value-objects/user-id.vo";

export const inMemoryUserRepository = Layer.succeed(
  UserRepository,
  UserRepository.of({
    findById: () =>
      Effect.succeed(
        User.make({
          id: UserId.make("123"),
          name: "John Doe",
          email: "john.doe@example.com",
          money: Money.make({
            amount: 100,
            currency: "USD",
          }),
        }),
      ),
    save: () => Effect.succeed(void 0),
  }),
);
