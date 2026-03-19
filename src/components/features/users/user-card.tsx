import Link from "next/link";

import { UserDto } from "@/core/application/users/dtos/create-user.dto";
import { Role } from "@/core/domain/users/enums/role.enum";
import { getUserLicensesMock } from "@/lib/user-licenses.mock";

const roleLabels: Record<Role, string> = {
  admin: "Admin",
  member: "Membre",
  reader: "Lecteur",
};

export const UserCard = ({ user }: { user: UserDto }) => {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const licensesCount = getUserLicensesMock(user).length;

  return (
    <Link
      href={`/users/${user.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-900"
    >
      <article className="relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-white shadow-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
              {user.name}
            </h2>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
              {roleLabels[user.role]}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
              {licensesCount} licence{licensesCount > 1 ? "s" : ""}
            </span>
          </div>

          <span className="inline-flex items-center text-[11px] font-medium text-sky-600 group-hover:underline dark:text-sky-400">
            Voir le détail
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-slate-900/5 via-transparent opacity-0 transition group-hover:opacity-100 dark:from-slate-0/10" />
      </article>
    </Link>
  );
};
