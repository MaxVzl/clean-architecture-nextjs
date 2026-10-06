import { Entity } from "../../common/entity.base";
import { UUID } from "../../common/value-objects/uuid.vo";
import { Role } from "../enums/role.enum";
import { Email } from "../value-objects/email.vo";

export type UserProps = {
  name: string;
  email: Email;
  role: Role;
  image: string | null;
  emailVerified: boolean;
};

export class User extends Entity<UserProps, UUID> {
  static create(props: Omit<UserProps, "image" | "emailVerified">): User {
    return this.make(
      {
        ...props,
        image: null,
        emailVerified: false,
      },
      UUID.generate(),
    );
  }

  changeName(name: string): void {
    this._props.name = name;
  }

  infos(): string {
    return `User ${this._props.name} has email ${this._props.email.value} and role ${this._id.value}`;
  }
}
