export abstract class Service<Dependencies = void> {
  constructor(protected readonly deps: Dependencies) {}
}
