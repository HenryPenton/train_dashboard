import { z } from "zod";

export const ApiConfigSchema = z.object({
  show_tfl_lines: z.boolean(),
  tfl_best_routes: z.array(
    z.object({
      origin: z.string(),
      originNaPTANOrATCO: z.string(),
      destination: z.string(),
      destinationNaPTANOrATCO: z.string(),
    }),
  ),
  rail_departures: z.array(
    z.object({
      origin: z.string(),
      originCode: z.string(),
      destination: z.string(),
      destinationCode: z.string(),
    }),
  ),
  refresh_timer: z.number(),
});
