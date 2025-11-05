import { z } from "zod";

const RailDepartureScheduleSchema = z.object({
  type: z.literal("rail_departure"),
  from_station_code: z.string().min(1),
  to_station_code: z.string().min(1),
  from_station_name: z.string().min(1),
  to_station_name: z.string().min(1),
  day_of_week: z.string().min(1), // comma-separated 3-letter days
  time: z.string().length(5), // e.g. "08:00"
});

const TubeLineStatusScheduleSchema = z.object({
  type: z.literal("tube_line_status"),
  day_of_week: z.string().min(1),
  time: z.string().min(1),
});

const BestRouteScheduleSchema = z.object({
  type: z.literal("best_route"),
  from_code: z.string().min(1),
  to_code: z.string().min(1),
  from_name: z.string().min(1),
  to_name: z.string().min(1),
  day_of_week: z.string().min(1),
  time: z.string().length(5),
});

const ScheduleSchema = z.discriminatedUnion("type", [
  RailDepartureScheduleSchema,
  TubeLineStatusScheduleSchema,
  BestRouteScheduleSchema,
]);

export const ApiSchedulesSchema = z.object({
  schedules: z.array(ScheduleSchema),
});
