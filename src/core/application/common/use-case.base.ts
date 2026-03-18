export abstract class UseCase<Dependencies, ReturnType, InputType = void> {
  constructor(protected readonly deps: Dependencies) {}

  abstract execute(params: InputType): Promise<ReturnType> | ReturnType;
}
