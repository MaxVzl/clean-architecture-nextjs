import { Role } from "@/core/domain/user/enums/role.enum";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  role: Role;
}
