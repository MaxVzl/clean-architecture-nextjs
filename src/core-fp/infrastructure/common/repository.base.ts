export const repository =
  <Deps, Output>(fn: (deps: Deps) => Output) =>
  (deps: Deps) =>
    fn(deps);
