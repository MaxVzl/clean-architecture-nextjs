type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type AnyModuleFactory = (deps: never) => object;

type InferModuleDeps<TModules extends readonly AnyModuleFactory[]> =
  UnionToIntersection<Parameters<TModules[number]>[0]>;

type InferModuleResults<TModules extends readonly AnyModuleFactory[]> =
  UnionToIntersection<ReturnType<TModules[number]>>;

export const createContainer = <
  const TModules extends readonly AnyModuleFactory[],
>(
  modules: TModules,
  deps: InferModuleDeps<TModules>,
): InferModuleResults<TModules> => {
  const container = {} as InferModuleResults<TModules>;

  for (const createModule of modules) {
    Object.assign(container as object, createModule(deps as never));
  }

  return container;
};
