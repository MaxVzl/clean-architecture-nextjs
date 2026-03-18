import { UserDto } from "@/core/application/users/dtos/create-user.dto";
import { Role } from "@/core/domain/users/enums/role.enum";

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

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-white shadow-sm">
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

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
          {roleLabels[user.role]}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900/5 via-transparent opacity-0 transition group-hover:opacity-100 dark:from-slate-0/10" />
    </article>
  );
};
