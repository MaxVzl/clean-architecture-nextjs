"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Search } from "@hugeicons/core-free-icons";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { useSearchUsers } from "@/hooks/features/users/use-search-users";

const SEARCH_ID = "users-search";

export const UsersSearchBar = () => {
  const [{ search }, setSearch] = useSearchUsers();

  return (
    <div className="flex w-full max-w-md flex-col gap-1">
      <label htmlFor={SEARCH_ID} className="sr-only">
        Rechercher un utilisateur
      </label>
      <InputGroup className="w-full">
        <InputGroupAddon align="inline-start">
          <HugeiconsIcon
            icon={Search}
            aria-hidden
            size={14}
            color="currentColor"
            strokeWidth={1.5}
          />
        </InputGroupAddon>
        <InputGroupInput
          id={SEARCH_ID}
          type="search"
          value={search}
          placeholder="Rechercher par nom ou e-mail…"
          autoComplete="off"
          onChange={(e) => setSearch({ search: e.target.value })}
        />
      </InputGroup>
    </div>
  );
};
