export const createService = <T, D, P>({
  constructor,
  services,
}: {
  constructor: (deps: D) => P;
  services: (desp: D, props: P) => T;
}) => {
  return (deps: D): T => services(deps, constructor(deps));
};
