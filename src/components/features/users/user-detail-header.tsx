import Link from "next/link";

import { UserDto } from "@/core/application/users/dtos/create-user.dto";
import { Role } from "@/core/domain/users/enums/role.enum";

const roleLabels: Record<Role, string> = {
  admin: "Admin",
  member: "Membre",
  reader: "Lecteur",
};

type UserDetailHeaderProps = {
  user: UserDto;
  monthlyTotal: number;
};

export function UserDetailHeader({ user, monthlyTotal }: UserDetailHeaderProps) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-indigo-500 text-xl font-semibold text-white shadow-sm">
          {initials}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
            Utilisateur
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {user.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {user.email}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
              {roleLabels[user.role]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 text-sm text-slate-700 dark:text-slate-200 sm:items-end">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Dépense mensuelle estimée
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {monthlyTotal.toFixed(2)} €
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Basé sur les licences logicielles actives de cet utilisateur.
          </p>
        </div>

        <Link
          href="/users"
          className="text-xs font-medium text-sky-600 underline-offset-2 hover:underline dark:text-sky-400"
        >
          ← Retour à la liste des utilisateurs
        </Link>
      </div>
    </header>
  );
}

