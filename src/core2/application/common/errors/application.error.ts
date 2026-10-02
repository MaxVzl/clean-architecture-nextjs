export type ApplicationError<Tag extends string, Payload = object> = Readonly<
  {
    type: Tag;
  } & Readonly<Payload>
>;
