"use client";

import { Button } from "@/components/ui/button";
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
      <Button
        onClick={() => setPaginated({ offset: offset - 1 })}
        disabled={offset === 1}
      >
        Previous
      </Button>
      <Button
        onClick={() => setPaginated({ offset: offset + 1 })}
        disabled={offset === pages}
      >
        Next
      </Button>
    </div>
  );
};
