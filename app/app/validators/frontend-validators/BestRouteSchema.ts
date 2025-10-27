import * as z from "zod";

export const BestRouteSchema = z.object({
  route: z.array(z.string()),
  duration: z.number(),
  arrival: z.string(),
  fare: z.number().nullable(),
});
