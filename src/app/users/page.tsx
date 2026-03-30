import { UsersSearchBar } from "@/app/users/users-search-bar";
import { sdk } from "@/lib/sdk";
import Link from "next/link";
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  SearchParams,
} from "nuqs/server";

export const searchParams = {
  search: parseAsString.withDefault(""),
  offset: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};
export const loadSearchParams = createLoader(searchParams);

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
