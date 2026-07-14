import Link from "next/link";

import { usersQueryService } from "@/lib/container";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await usersQueryService.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return (
    <main>
      <h1>User</h1>
      <p>{user.name}</p>
      <Link href={`/users/${userId}/posts`}>Posts</Link>
    </main>
  );
}
