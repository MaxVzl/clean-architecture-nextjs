import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-6rem)] bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
              Dashboard
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Gestion des dépenses logicielles
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
              Accédez rapidement aux utilisateurs et au catalogue des licences.
            </p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/users"
            className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700"
          >
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Utilisateurs
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Voir les membres de l&apos;équipe et leurs infos.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center text-xs font-medium text-sky-600 group-hover:underline dark:text-sky-400">
              Ouvrir →
            </span>
          </Link>

          <Link
            href="/licenses"
            className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700"
          >
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Licences
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Consulter toutes les licences disponibles (mock).
              </p>
            </div>
            <span className="mt-4 inline-flex items-center text-xs font-medium text-sky-600 group-hover:underline dark:text-sky-400">
              Ouvrir →
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}
