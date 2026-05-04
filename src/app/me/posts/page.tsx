import Link from "next/link";

import { listPostsUseCase } from "@/lib/factories";
import { getSession } from "@/lib/auth";

export default async function MePostsPage() {
  const session = await getSession();
  const posts = await listPostsUseCase.execute({ userId: session.user.id });
  return (
    <main>
      <h1>Mes posts</h1>
      <p>
        <Link href="/me/posts/new">Nouveau post</Link>
      </p>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  );
}
