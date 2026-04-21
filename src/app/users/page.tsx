import { UserCard } from "@/app/users/_components/user-card";
import { UsersSearchBar } from "@/app/users/_components/users-search-bar";
import { loadSearchParams } from "@/app/users/search-params";
import { Paginated } from "@/components/paginated";
import { sdk } from "@/lib/sdk";
import { SearchParams } from "nuqs/server";

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
    search,
    limit,
    offset,
  });

  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="font-heading text-2xl font-semibold">Utilisateurs</h1>
      <UsersSearchBar />
      <Paginated total={total} pages={pages} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </main>
  );
}
