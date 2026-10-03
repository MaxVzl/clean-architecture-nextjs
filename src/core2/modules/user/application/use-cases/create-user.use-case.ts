import { Context, Effect, Layer } from "effect";
import { v4 } from "uuid";

import { CreateUserCommand } from "@/core2/modules/user/application/commands/create-user.command";
import { User } from "@/core2/modules/user/domain/user.entity";
import { UserRepository } from "@/core2/modules/user/domain/user.repository";
import { Money } from "@/core2/modules/user/domain/value-objects/money.vo";
import { UserId } from "@/core2/modules/user/domain/value-objects/user-id.vo";

export class CreateUserUseCase extends Context.Service<
  CreateUserUseCase,
  {
    execute: (command: CreateUserCommand) => Effect.Effect<void>;
  }
>()("CreateUserUseCase") {}

export const createUserUseCase = Layer.effect(
  CreateUserUseCase,
  Effect.gen(function* () {
    const userRepository = yield* UserRepository;

    return {
      execute: (command) => {
        const user = User.make({
          id: UserId.make(v4()),
          name: command.name,
          email: command.email,
          money: Money.make({
            amount: command.money.amount,
            currency: command.money.currency,
          }),
        });
        userRepository.save(user);
        return Effect.succeed(void 0);
      },
    };
  }),
);
