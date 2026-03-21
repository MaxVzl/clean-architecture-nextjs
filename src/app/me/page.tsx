import { sdk } from "@/lib/skd";

export default async function MePage() {
  const user = await sdk.me();
  return (
    <main>
      <h1>Me</h1>
      <p>{user.name}</p>
    </main>
  );
}
