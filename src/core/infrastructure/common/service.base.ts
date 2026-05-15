export abstract class Service<Dependencies> {
  constructor(protected readonly deps: Dependencies) {}
}
