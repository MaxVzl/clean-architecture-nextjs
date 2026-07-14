export abstract class Middleware<Dependencies> {
  constructor(protected readonly deps: Dependencies) {}
}
