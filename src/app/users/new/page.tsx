"use client";

import { createUserAction } from "@/app/users/new/actions";
import { Role } from "@/core/domain/users/enums/role.enum";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";

export default function NewUserPage() {
  const router = useRouter();
  const { execute } = useAction(createUserAction, {
    onSuccess: () => {
      router.push("/users");
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    execute({
      data: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        role: formData.get("role") as Role,
      },
    });
  };
  return (
    <main>
      <h1>New User</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" />
        <input type="email" name="email" placeholder="Email" />
        <select name="role" defaultValue={Role.USER}>
          <option value={Role.ADMIN}>Administrateur</option>
          <option value={Role.USER}>Utilisateur</option>
        </select>
        <button type="submit">Create</button>
      </form>
    </main>
  );
}
