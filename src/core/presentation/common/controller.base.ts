export abstract class Controller<Dependencies> {
  constructor(protected readonly deps: Dependencies) {}
}
