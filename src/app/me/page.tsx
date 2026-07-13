import { getSession } from "@/lib/auth";
import { container } from "@/lib/container";

export default async function MePage() {
  const session = await getSession();
  const user = await container.usersQueryService.findById(session.user.id);
  if (!user) {
    throw new Error("User not found");
  }
  return (
    <main>
      <h1>Me</h1>
      <p>{user.name}</p>
    </main>
  );
}
