import { container } from "@/lib/container/container.prod";

const { listPostUseCase } = container;

export default async function PostsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const posts = await listPostUseCase.execute({ userId });
  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  );
}
