"use client";

import { useSearchUsers } from "@/hooks/features/users/use-search-users";

export const UsersSearchBar = () => {
  const [{ search }, setSearch] = useSearchUsers();

  return (
    <input
      value={search}
      placeholder="Search"
      onChange={(e) => setSearch({ search: e.target.value })}
    />
  );
};
