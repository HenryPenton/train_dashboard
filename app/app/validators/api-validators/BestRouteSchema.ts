import * as z from "zod";

const BackendLegSchema = z.object({
  mode: z.string(),
  instruction: z.string(),
  departure: z.string(),
  arrival: z.string(),
  line: z.string(),
});

export const BackendResponseSchema = z.object({
  duration: z.number(),
  arrival: z.string(),
  legs: z.array(BackendLegSchema),
  fare: z.number().optional(),
});
