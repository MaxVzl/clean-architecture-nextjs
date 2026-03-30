import { UsersSearchBar } from "@/app/users/users-search-bar";
import { sdk } from "@/lib/sdk";
import Link from "next/link";
import { SearchParams } from "nuqs/server";
import { loadSearchParams } from "@/app/users/search-params";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const {
    search,
    limit: limitParam,
    offset: offsetParam,
  } = await loadSearchParams(searchParams);

  const {
    data: users,
    total,
    offset,
    limit,
    pages,
  } = await sdk.users.list({
    params: { search },
    limit: limitParam,
    offset: offsetParam,
  });

  return (
    <main>
      <h1>Users</h1>
      <UsersSearchBar />
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
      <div>
        <p>Total: {total}</p>
        <p>Offset: {offset}</p>
        <p>Limit: {limit}</p>
        <p>Pages: {pages}</p>
      </div>
    </main>
  );
}
