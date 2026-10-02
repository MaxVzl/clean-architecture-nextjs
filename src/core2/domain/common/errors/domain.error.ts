export type DomainError<Tag extends string, Payload = object> = Readonly<
  {
    type: Tag;
  } & Readonly<Payload>
>;
