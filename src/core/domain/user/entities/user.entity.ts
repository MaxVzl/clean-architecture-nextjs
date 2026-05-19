import { Entity } from "../../common/entity.base";
import { Role } from "../enums/role.enum";
import { UUID } from "../../common/value-objects/uuid.vo";
import { Email } from "../value-objects/email.vo";

export type UserProps = {
  name: string;
  email: Email;
  role: Role;
  image: string | null;
  emailVerified: boolean;
};

export class User extends Entity<UserProps, UUID> {
  static create(
    props: Omit<UserProps, "image" | "emailVerified">,
  ): User {
    return new User(
      {
        ...props,
        image: null,
        emailVerified: false,
      },
      UUID.generate(),
    );
  }

  get name(): string {
    return this._props.name;
  }

  get email(): Email {
    return this._props.email;
  }

  get role(): Role {
    return this._props.role;
  }

  get image(): string | null {
    return this._props.image;
  }

  get emailVerified(): boolean {
    return this._props.emailVerified;
  }
}
