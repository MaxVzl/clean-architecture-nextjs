export type ModuleExports = {
  controllers?: Record<string, unknown>;
  useCases?: Record<string, unknown>;
  services?: Record<string, unknown>;
};

type Module = (deps: any) => ModuleExports;

type MergeDeps<T extends readonly Module[]> = T extends readonly [
  infer First,
  ...infer Rest,
]
  ? First extends (deps: infer D) => any
    ? Rest extends readonly Module[]
      ? D & MergeDeps<Rest>
      : D
    : never
  : {};

type MergeReturns<T extends readonly Module[]> = T extends readonly [
  infer First,
  ...infer Rest,
]
  ? First extends (deps: any) => infer R
    ? Rest extends readonly Module[]
      ? R & MergeReturns<Rest>
      : R
    : never
  : {};

export const mergeModules = <const TModules extends readonly Module[]>(
  modules: TModules,
): ((deps: MergeDeps<TModules>) => MergeReturns<TModules>) => {
  return (deps) => {
    const container = {} as MergeReturns<TModules>;

    for (const module of modules) {
      Object.assign(container, module(deps));
    }

    return container;
  };
};

export const createModule =
  <TDeps extends Record<string, unknown>>(fn: (deps: TDeps) => ModuleExports) =>
  (deps: TDeps) =>
    fn(deps);
