import { container } from "@/lib/container/container.prod";
import Link from "next/link";

const { getUserUseCase } = container;

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUserUseCase.execute(userId);
  return (
    <main>
      <h1>User</h1>
      <p>{user.name}</p>
      <Link href={`/users/${userId}/posts`}>Posts</Link>
    </main>
  );
}
