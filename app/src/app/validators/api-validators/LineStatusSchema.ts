import * as z from "zod";

export const ApiLineStatusSchema = z.object({
  name: z.string(),
  status: z.string(),
  statusSeverity: z.number(),
});

export const ApiLineStatusesSchema = z.array(ApiLineStatusSchema);
