export abstract class Repository<Dependencies = void> {
  constructor(protected readonly deps: Dependencies) {}
}
