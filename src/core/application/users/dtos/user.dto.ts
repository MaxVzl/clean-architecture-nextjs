import { Role } from "@/core/domain/users/enums/role.enum";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: Role;
}
