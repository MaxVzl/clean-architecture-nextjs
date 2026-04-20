"use client";

import { createPostAction } from "@/app/me/posts/new/actions";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";

export default function NewMePostPage() {
  const router = useRouter();
  const { execute } = useAction(createPostAction, {
    onSuccess: () => {
      router.push("/me/posts");
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    execute({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    });
  };
  return (
    <main>
      <h1>Nouveau post</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Titre" required />
        <textarea name="description" placeholder="Description" rows={4} />
        <button type="submit">Créer</button>
      </form>
    </main>
  );
}
