"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import type { FormEvent } from "react";

import { createPostAction } from "@/app/me/posts/new/actions";

export function PostForm() {
  const router = useRouter();
  const { execute } = useAction(createPostAction, {
    onSuccess: () => {
      router.push("/me/posts");
    },
  });
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    execute({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Titre" required />
      <textarea name="description" placeholder="Description" rows={4} />
      <button type="submit">Créer</button>
    </form>
  );
}
