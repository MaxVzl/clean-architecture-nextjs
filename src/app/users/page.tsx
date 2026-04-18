import { UsersSearchBar } from "@/app/users/users-search-bar";
import { sdk } from "@/lib/sdk";
import Link from "next/link";
import { SearchParams } from "nuqs/server";
import { loadSearchParams } from "@/app/users/search-params";
import { Paginated } from "@/components/paginated";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { search, limit, offset } = await loadSearchParams(searchParams);

  const {
    data: users,
    total,
    pages,
  } = await sdk.users.list({
    params: { search },
    limit,
    offset,
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
      <Paginated total={total} pages={pages} />
    </main>
  );
}
