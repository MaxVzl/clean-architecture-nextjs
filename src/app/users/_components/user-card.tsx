"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { CheckCircle } from "@hugeicons/core-free-icons";
import Link from "next/link";

import type { UserDto } from "@/core/application/users/dtos/user.dto";
import { Role } from "@/core/domain/users/enums/role.enum";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

export function UserCard({ user }: { user: UserDto }) {
  return (
    <Link
      href={`/users/${user.id}`}
      aria-label={`Voir le profil de ${user.name}`}
      className={cn(
        "block rounded-lg outline-none transition-shadow",
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <Card
        className={cn(
          "h-full border-border/80 bg-card transition-shadow hover:shadow-md",
        )}
      >
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full p-0.5 ring-2 ring-border">
            <Avatar size="lg" className="size-20 ring-2 ring-background">
              <AvatarImage src={user.image ?? undefined} alt="" />
              <AvatarFallback className="text-base font-medium">
                {initialsFromName(user.name)}
              </AvatarFallback>
              {user.emailVerified ? (
                <AvatarBadge
                  className="bg-emerald-500 text-white ring-background"
                  title="Email vérifié"
                >
                  <HugeiconsIcon
                    icon={CheckCircle}
                    aria-hidden
                    size={10}
                    color="currentColor"
                    strokeWidth={2}
                  />
                </AvatarBadge>
              ) : null}
            </Avatar>
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-semibold">{user.name}</CardTitle>
            <CardDescription className="line-clamp-2 text-sm">
              {user.email}
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {user.role === Role.ADMIN ? "Administrateur" : "Utilisateur"}
          </Badge>
        </CardHeader>
      </Card>
    </Link>
  );
}
