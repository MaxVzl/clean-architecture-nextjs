"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { DevQuickLoginButton } from "@/components/dev-quick-login-button";
import { UserMenu } from "@/components/user-menu";

export function AppHeader() {
  const { data } = authClient.useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-sm font-medium text-foreground hover:text-foreground/80"
        >
          Accueil
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {data?.user ? (
            <UserMenu
              name={data.user.name}
              email={data.user.email}
              image={data.user.image}
            />
          ) : (
            <DevQuickLoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
