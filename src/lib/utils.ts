import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Role } from "@/core/domain/users/enums/role.enum";
import { authClient } from "@/lib/auth-client";
import { Session, User } from "better-auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const withAuth = async <T>(
//   action: (currentUser: UserDto) => Promise<T>,
// ): Promise<T> => {
//   const user: UserDto = {
//     id: "4ebd1244-bef0-4b01-ba3e-74fae09aeb90",
//     name: "John Doe",
//     email: "john.doe@example.com",
//     role: "admin",
//   };
//   return action(user);
// };
export const withAuth = async <T>(
  action: (currentSession: { session: Session; user: User }) => Promise<T>,
): Promise<T> => {
  // const session = await auth.api.getSession();
  const session = await authClient.getSession();
  if (!session.data) {
    throw new Error("Unauthorized");
  }
  return action(session.data);
};

// export const withRoles = async <T>(
//   allowedRoles: Role[],
//   action: (currentUser: UserDto) => Promise<T>,
// ): Promise<T> => {
//   const user: UserDto = {
//     id: "4ebd1244-bef0-4b01-ba3e-74fae09aeb90",
//     name: "John Doe",
//     email: "john.doe@example.com",
//     role: "admin",
//   };

//   if (!allowedRoles.includes(user.role)) {
//     throw new Error(
//       "Accès refusé : Vous n'avez pas les permissions nécessaires.",
//     );
//   }

//   return action(user);
// };
export const withRoles = async <T>(
  allowedRoles: Role[],
  action: (currentSession: { session: Session; user: User }) => Promise<T>,
): Promise<T> => {
  const session = await authClient.getSession();
  if (!session.data) {
    throw new Error("Unauthorized");
  }

  // if (!allowedRoles.includes(session.user.role)) {
  if (!allowedRoles.includes((session.data.user as any).role)) {
    throw new Error(
      "Accès refusé : Vous n'avez pas les permissions nécessaires.",
    );
  }

  return action(session.data);
};
