import { sdk } from "@/lib/sdk";
import Link from "next/link";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await sdk.users.show({ id: userId });
  return (
    <main>
      <h1>User</h1>
      <p>{user.name}</p>
      <Link href={`/users/${userId}/posts`}>Posts</Link>
    </main>
  );
}
