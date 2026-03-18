import { UserLicense } from "@/lib/user-licenses.mock";

type UserLicensesListProps = {
  licenses: UserLicense[];
};

function getScopeLabel(license: UserLicense): string {
  switch (license.scope) {
    case "per-person":
      return "Individuel";
    case "per-n-persons":
      return license.maxPersons != null
        ? `Partagé (${license.maxPersons} pers.)`
        : "Partagé";
    case "per-seat":
      return "Par siège";
    default:
      return "—";
  }
}

function getScopeBadgeClassName(license: UserLicense): string {
  switch (license.scope) {
    case "per-person":
      return "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300";
    case "per-n-persons":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    case "per-seat":
      return "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300";
  }
}

export function UserLicensesList({ licenses }: UserLicensesListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-5">
      <header className="mb-4 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Licences logicielles
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Liste des abonnements logiciels associés à ce membre de
            l&apos;équipe.
          </p>
        </div>
        {licenses.length > 0 && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
            {licenses.length} licence{licenses.length > 1 ? "s" : ""}
          </span>
        )}
      </header>

      {licenses.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Aucune licence n&apos;est encore associée à cet utilisateur.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[640px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 text-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-100/80 px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
              <span className="col-span-2">Logiciel</span>
              <span>Fournisseur</span>
              <span>Type de licence</span>
              <span>Coût mensuel</span>
              <span>Statut</span>
            </div>
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {licenses.map((license) => (
                <li
                  key={license.id}
                  className="grid grid-cols-6 items-center px-3 py-3 text-xs text-slate-700 dark:text-slate-200"
                >
                  <div className="col-span-2">
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {license.softwareName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      Facturation{" "}
                      {license.billingCycle === "monthly"
                        ? "mensuelle"
                        : "annuelle"}
                    </p>
                  </div>
                  <div>
                    <p>{license.vendor}</p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${getScopeBadgeClassName(
                        license,
                      )}`}
                    >
                      {getScopeLabel(license)}
                    </span>
                  </div>
                  <div>
                    <p>
                      {license.monthlyCost.toFixed(2)}{" "}
                      {license.currency === "EUR" ? "€" : license.currency}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        license.status === "active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300"
                      }`}
                    >
                      {license.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
