import Link from "next/link";
import { Suspense } from "react";
import { UsersList } from "@/components/features/users/users-list";

export default async function UsersPage() {
  return (
    <main className="min-h-[calc(100vh-6rem)] bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
              Équipe
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Utilisateurs
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
              Retrouvez les membres de votre application, avec leurs infos
              principales, dans une vue claire et agréable.
            </p>
          </div>

          <div className="mt-2 flex flex-col items-end gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link
              href="/"
              className="text-[11px] font-medium text-sky-600 underline-offset-2 hover:underline dark:text-sky-400"
            >
              ← Retour au dashboard
            </Link>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-dashed border-slate-300 px-3 py-1 dark:border-slate-700">
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Vue en temps réel
              </span>

              <Link
                href="/users/new"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-sky-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:bg-sky-500 dark:hover:bg-sky-400 dark:focus-visible:ring-offset-slate-900"
              >
                + Nouvel utilisateur
              </Link>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-5">
          <Suspense
            fallback={
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/80"
                  />
                ))}
              </div>
            }
          >
            <UsersList />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
