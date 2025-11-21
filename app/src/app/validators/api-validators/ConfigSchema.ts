import { z } from "zod";

export const ApiConfigSchema = z.object({
  show_tfl_lines: z.boolean(),
  tfl_line_status: z.object({
    enabled: z.boolean(),
    importance: z.number(),
  }),
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
