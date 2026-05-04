import { getSession } from "@/lib/auth";
import { getUserUseCase } from "@/lib/factories";

export default async function MePage() {
  const session = await getSession();
  const user = await getUserUseCase.execute(session.user.id);
  return (
    <main>
      <h1>Me</h1>
      <p>{user.name}</p>
    </main>
  );
}
