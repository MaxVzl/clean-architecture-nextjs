import { sdk } from "@/lib/skd";
import Link from "next/link";

export default async function UsersPage() {
  const users = await sdk.users.list();
  return (
    <main>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
