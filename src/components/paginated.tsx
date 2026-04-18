"use client";

import { usePaginated } from "@/hooks/use-paginated";

export const Paginated = ({
  total,
  pages,
}: {
  total: number;
  pages: number;
}) => {
  const [{ limit, offset }, setPaginated] = usePaginated();
  return (
    <div>
      <div>
        <p>Total: {total}</p>
        <p>Offset: {offset}</p>
        <p>Limit: {limit}</p>
        <p>Pages: {pages}</p>
      </div>
      <button
        onClick={() => setPaginated({ offset: offset - 1 })}
        disabled={offset === 1}
      >
        Previous
      </button>
      <button
        onClick={() => setPaginated({ offset: offset + 1 })}
        disabled={offset === pages}
      >
        Next
      </button>
    </div>
  );
};
