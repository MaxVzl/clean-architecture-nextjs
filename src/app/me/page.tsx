import { getSession } from "@/lib/auth";
import { container } from "@/lib/container/container.prod";

const { getUserUseCase } = container;

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
