import Link from "next/link";
import { Software } from "@/lib/software.mock";

type SoftwareListProps = {
  software: Software[];
};

export function SoftwareList({ software }: SoftwareListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-5">
      <header className="mb-4 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Logiciels
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Liste des logiciels référencés avec leur catégorie et site web.
          </p>
        </div>
        {software.length > 0 && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
            {software.length} logiciel{software.length > 1 ? "s" : ""}
          </span>
        )}
      </header>

      {software.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Aucun logiciel enregistré.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[480px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 text-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-100/80 px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
              <span className="col-span-2">Nom</span>
              <span>Catégorie</span>
              <span>Site web</span>
            </div>
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {software.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-4 items-center px-3 py-3 text-xs text-slate-700 dark:text-slate-200"
                >
                  <div className="col-span-2">
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {item.name}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                      {item.category}
                    </span>
                  </div>
                  <div>
                    <Link
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 underline-offset-2 hover:underline dark:text-sky-400"
                    >
                      {new URL(item.websiteUrl).hostname}
                    </Link>
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
