import { UserDto } from "@/core/application/users/dtos/create-user.dto";
import { Entity } from "../../common/entity.base";
import { Role } from "../enums/role.enum";
import { UUID } from "../../common/value-objects/uuid.vo";
import { Email } from "../value-objects/email.vo";

export type UserProps = {
  name: string;
  email: Email;
  role: Role;
};

export class User extends Entity<UserProps, UUID, UserDto> {
  static async create(props: UserProps): Promise<User> {
    return new User(props, UUID.generate());
  }

  toDto(): UserDto {
    return {
      id: this.id.value,
      name: this._props.name,
      email: this._props.email.value,
      role: this._props.role,
    };
  }
}
