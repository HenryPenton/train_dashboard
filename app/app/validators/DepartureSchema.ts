import * as z from "zod";

export const DepartureSchema = z.object({
  delay: z.number(),
  status: z.enum(["Early", "On time", "Late"]),
  actual: z.string(),
  platform: z.string(),
  origin: z.string(),
  destination: z.string(),
});

export const Departures = z.array(DepartureSchema);
