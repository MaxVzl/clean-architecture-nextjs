export const useCase =
  <Deps, Input, Output>(fn: (deps: Deps, input: Input) => Promise<Output>) =>
  (deps: Deps) =>
  (input: Input): Promise<Output> =>
    fn(deps, input);
