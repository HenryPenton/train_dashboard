import * as z from "zod";

export const RailDepartureSchema = z.object({
  delay: z.number(),
  status: z.enum(["Early", "On time", "Late"]),
  actual: z.string(),
  platform: z.string(),
  origin: z.string(),
  destination: z.string(),
});

export const ApiRailDeparturesSchema = z.array(RailDepartureSchema);
