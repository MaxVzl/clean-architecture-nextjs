import Link from "next/link";

import { sdk } from "@/lib/sdk";

export default async function MePostsPage() {
  const posts = await sdk.posts.list();
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
