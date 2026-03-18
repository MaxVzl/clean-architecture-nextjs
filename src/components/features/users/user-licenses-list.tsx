import { UserLicense } from "@/lib/user-licenses.mock";

type GroupedLicense = {
  representative: UserLicense;
  count: number;
  totalMonthlyCost: number;
};

type UserLicensesListProps = {
  licenses: UserLicense[];
  /** Regrouper les licences identiques (même logiciel) sur une ligne avec quantité et total */
  groupBySoftware?: boolean;
};

function groupLicensesBySoftware(licenses: UserLicense[]): GroupedLicense[] {
  const byName = new Map<string, UserLicense[]>();
  for (const license of licenses) {
    const key = license.softwareName;
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key)!.push(license);
  }
  return Array.from(byName.entries()).map(([, group]) => {
    const representative = group[0];
    const count = group.length;
    const totalMonthlyCost = group.reduce((sum, l) => sum + l.monthlyCost, 0);
    return { representative, count, totalMonthlyCost };
  });
}

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

export function UserLicensesList({
  licenses,
  groupBySoftware = false,
}: UserLicensesListProps) {
  const grouped = groupBySoftware ? groupLicensesBySoftware(licenses) : null;
  const displayCount =
    groupBySoftware && grouped ? grouped.length : licenses.length;

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
            {displayCount} licence{displayCount > 1 ? "s" : ""}
            {groupBySoftware && licenses.length !== displayCount && (
              <span className="ml-1 text-slate-500">
                ({licenses.length} au total)
              </span>
            )}
          </span>
        )}
      </header>

      {licenses.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Aucune licence n&apos;est encore associée à cet utilisateur.
        </p>
      ) : groupBySoftware && grouped ? (
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
              {grouped.map(({ representative, count, totalMonthlyCost }) => (
                <li
                  key={representative.id}
                  className={`grid grid-cols-6 items-center px-3 py-3 text-xs text-slate-700 dark:text-slate-200 ${
                    count > 1
                      ? "border-l-4 border-amber-400 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-900/20"
                      : ""
                  }`}
                >
                  <div className="col-span-2">
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {count > 1
                        ? `${representative.softwareName} x ${count}`
                        : representative.softwareName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      Facturation{" "}
                      {representative.billingCycle === "monthly"
                        ? "mensuelle"
                        : "annuelle"}
                      {count > 1 && (
                        <span className="ml-1.5 inline-flex items-center text-amber-600 dark:text-amber-400">
                          <span className="mr-1 size-3.5 rounded-full bg-amber-400 dark:bg-amber-500" aria-hidden />
                          Plusieurs licences
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p>{representative.vendor}</p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${getScopeBadgeClassName(
                        representative,
                      )}`}
                    >
                      {getScopeLabel(representative)}
                    </span>
                  </div>
                  <div className="tabular-nums">
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {totalMonthlyCost.toFixed(2)}{" "}
                      {representative.currency === "EUR"
                        ? "€"
                        : representative.currency}
                    </p>
                    {count > 1 && (
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {representative.monthlyCost.toFixed(2)}{" "}
                        {representative.currency === "EUR"
                          ? "€"
                          : representative.currency}
                      </p>
                    )}
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        representative.status === "active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300"
                      }`}
                    >
                      {representative.status === "active"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
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
