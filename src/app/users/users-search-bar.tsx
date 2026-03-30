"use client";

import { useQueryState } from "nuqs";

export const UsersSearchBar = () => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    shallow: false,
  });

  return (
    <input
      value={search}
      placeholder="Search"
      onChange={(e) => setSearch(e.target.value || null)}
    />
  );
};
