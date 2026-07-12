import Link from "next/link";

import { getSession } from "@/lib/auth";
import { container } from "@/lib/container";

const { postsQueryService } = container;

export default async function MePostsPage() {
  const session = await getSession();
  const { data: posts } = await postsQueryService.findByUserId(
    session.user.id,
    {},
  );
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
