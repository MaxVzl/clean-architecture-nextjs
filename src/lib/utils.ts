import { UserDto } from "@/core/application/users/dtos/create-user.dto";
import { Role } from "@/core/domain/users/enums/role.enum";

export const withAuth = async <T>(
  action: (currentUser: UserDto) => Promise<T>,
): Promise<T> => {
  const user: UserDto = {
    id: "4ebd1244-bef0-4b01-ba3e-74fae09aeb90",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
  };
  return action(user);
};

export const withRoles = async <T>(
  allowedRoles: Role[],
  action: (currentUser: UserDto) => Promise<T>,
): Promise<T> => {
  const user: UserDto = {
    id: "4ebd1244-bef0-4b01-ba3e-74fae09aeb90",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
  };

  if (!allowedRoles.includes(user.role)) {
    throw new Error(
      "Accès refusé : Vous n'avez pas les permissions nécessaires.",
    );
  }

  return action(user);
};
