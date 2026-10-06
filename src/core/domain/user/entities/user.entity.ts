import { Entity } from "../../common/entity.base";
import { Role } from "../enums/role.enum";
import { Email } from "../value-objects/email.vo";
import { UserId } from "../value-objects/user-id.vo";
import { UserName } from "../value-objects/user-name.vo";

export type UserProps = {
  name: UserName;
  email: Email;
  role: Role;
  image: string | null;
  emailVerified: boolean;
};

export class User extends Entity<UserProps, UserId> {
  static create(props: Omit<UserProps, "image" | "emailVerified">): User {
    return this.make(
      {
        ...props,
        image: null,
        emailVerified: false,
      },
      UserId.generate(),
    );
  }

  changeName(name: UserName): void {
    this._props.name = name;
  }

  infos(): string {
    return `User ${this._props.name.value} has email ${this._props.email.value} and role ${this._props.role}`;
  }
}
