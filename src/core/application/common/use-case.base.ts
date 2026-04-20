export abstract class UseCase<
  Dependencies,
  ReturnType,
  InputType = void,
  ContextType = void,
> {
  constructor(protected readonly deps: Dependencies) {}

  abstract execute(
    params: InputType,
    context?: ContextType,
  ): Promise<ReturnType> | ReturnType;
}
