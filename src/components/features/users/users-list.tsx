import { UserCard } from "./user-card";
import { getUsersUseCase } from "@/factories/users.factories";

export const UsersList = async () => {
  const users = await getUsersUseCase.execute();
  return (
    <section className="space-y-4">
      <header className="flex items-baseline justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Utilisateurs
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Une petite équipe sympa, prête à collaborer.
          </p>
        </div>
        {users && users.length > 0 && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
            {users.length} membre{users.length > 1 ? "s" : ""}
          </span>
        )}
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users?.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </section>
  );
};
