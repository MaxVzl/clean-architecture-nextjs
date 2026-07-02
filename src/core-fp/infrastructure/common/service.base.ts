export const service =
  <Deps, Output>(fn: (deps: Deps) => Output) =>
  (deps: Deps) =>
    fn(deps);
