import z from "zod";

type ModuleService = {
  send: ({ message }: { message: string }) => Promise<void>;
};

const createModule = ({
  schema,
  service,
}: {
  schema: z.ZodSchema;
  service: ModuleService;
}) => {
  return {
    schema,
    service,
  };
};

const module = createModule({
  schema: z.object({
    apiUrl: z.string(),
    apiKey: z.string(),
  }),
  service: ({ apiUrl, apiKey }: { apiUrl: string; apiKey: string }) => ({
    send: async ({ message }: { message: string }) => {
      console.log(apiUrl, apiKey, message);
    },
  }),
});
