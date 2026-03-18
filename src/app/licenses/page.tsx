import Link from "next/link";

import { getAllLicensesMock } from "@/lib/user-licenses.mock";
import { UserLicensesList } from "@/components/features/users/user-licenses-list";

export default function LicensesPage() {
  const licenses = getAllLicensesMock();

  return (
    <main className="min-h-[calc(100vh-6rem)] bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
              Catalogue
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Licences logicielles
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
              Vue globale de toutes les licences logicielles utilisées par
              l&apos;équipe, pour suivre et optimiser vos dépenses.
            </p>
          </div>

          <div className="mt-2 flex flex-col items-end gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link
              href="/"
              className="text-[11px] font-medium text-sky-600 underline-offset-2 hover:underline dark:text-sky-400"
            >
              ← Retour au dashboard
            </Link>
          </div>
        </header>

        <UserLicensesList licenses={licenses} />
      </div>
    </main>
  );
}

