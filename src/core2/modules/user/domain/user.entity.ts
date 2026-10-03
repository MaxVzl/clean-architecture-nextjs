import { Schema } from "effect";

import { Money } from "./value-objects/money.vo";
import { UserId } from "./value-objects/user-id.vo";

export class User extends Schema.Class<User>("User")({
  id: UserId,
  name: Schema.String,
  email: Schema.String,
  money: Money,
}) {
  changeName(name: string) {
    return User.make({
      ...this,
      name,
    });
  }
}
