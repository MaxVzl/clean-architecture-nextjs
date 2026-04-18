"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft, ArrowRight } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS, type PageSizeOption } from "@/config/pagination";
import { usePaginated } from "@/hooks/use-paginated";
import { cn } from "@/lib/utils";

export const Paginated = ({
  total,
  pages,
}: {
  total: number;
  pages: number;
}) => {
  const [{ limit, offset }, setPaginated] = usePaginated();

  const noResults = total === 0;
  const prevDisabled = noResults || pages === 0 || offset <= 1;
  const nextDisabled = noResults || pages === 0 || offset >= pages;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-border/80 bg-card/50 p-4",
        "sm:flex-row sm:items-center sm:justify-between",
      )}
    >
      <p className="text-sm text-muted-foreground">
        {noResults ? (
          "Aucun résultat"
        ) : (
          <>
            Page {offset} sur {pages}
            <span className="text-border"> · </span>
            {total} {total > 1 ? "résultats" : "résultat"}
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Par page</span>
          <Select
            value={String(limit)}
            onValueChange={(value) => {
              const next = Number(value) as PageSizeOption;
              void setPaginated({ limit: next, offset: 1 });
            }}
          >
            <SelectTrigger
              size="sm"
              className="min-w-16"
              aria-label="Nombre d’éléments par page"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={prevDisabled}
            aria-label="Page précédente"
            onClick={() => setPaginated({ offset: offset - 1 })}
          >
            <HugeiconsIcon
              icon={ArrowLeft}
              data-icon="inline-start"
              size={14}
              color="currentColor"
              strokeWidth={1.5}
            />
            Précédent
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={nextDisabled}
            aria-label="Page suivante"
            onClick={() => setPaginated({ offset: offset + 1 })}
          >
            Suivant
            <HugeiconsIcon
              icon={ArrowRight}
              data-icon="inline-end"
              size={14}
              color="currentColor"
              strokeWidth={1.5}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
