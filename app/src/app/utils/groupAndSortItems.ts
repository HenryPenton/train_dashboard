import {
  BestRoute,
  ConfigType,
  DepartureConfig,
  TflLineStatusConfig,
  TubeDeparture,
} from "../stores/config";

type Positioned = {
  col_2_position: number;
  col_3_position: number;
  importance: number;
};

export type ConfigItem = Positioned &
  (
    | { type: "rail_departure"; item: DepartureConfig }
    | { type: "tfl_best_route"; item: BestRoute }
    | { type: "tube_departure"; item: TubeDeparture }
    | { type: "tfl_line_status"; item: TflLineStatusConfig }
  );

/** Flattens every configured section into a single list of items. */
export function buildConfigItems(config: ConfigType | null): ConfigItem[] {
  if (!config) return [];

  const items: ConfigItem[] = [
    ...config.rail_departures.map((item) => ({
      type: "rail_departure" as const,
      item,
      col_2_position: item.col_2_position,
      col_3_position: item.col_3_position,
      importance: item.importance,
    })),
    ...config.tfl_best_routes.map((item) => ({
      type: "tfl_best_route" as const,
      item,
      col_2_position: item.col_2_position,
      col_3_position: item.col_3_position,
      importance: item.importance,
    })),
    ...config.tube_departures.map((item) => ({
      type: "tube_departure" as const,
      item,
      col_2_position: item.col_2_position,
      col_3_position: item.col_3_position,
      importance: item.importance,
    })),
  ];

  if (config.tfl_line_status?.enabled) {
    items.push({
      type: "tfl_line_status",
      item: config.tfl_line_status,
      col_2_position: config.tfl_line_status.col_2_position,
      col_3_position: config.tfl_line_status.col_3_position,
      importance: config.tfl_line_status.importance,
    });
  }

  return items;
}

/**
 * Distributes items into `numColumns` columns using the configured column
 * positions, then sorts each column by importance.
 */
export function groupAndSortItems(
  items: ConfigItem[],
  numColumns: number,
): ConfigItem[][] {
  const columns: ConfigItem[][] = Array.from({ length: numColumns }, () => []);

  items.forEach((item) => {
    let columnIndex = 0;
    if (numColumns === 2) {
      columnIndex = Math.min(item.col_2_position - 1, 1);
    } else if (numColumns === 3) {
      columnIndex = Math.min(item.col_3_position - 1, 2);
    }
    columns[columnIndex].push(item);
  });

  columns.forEach((column) => {
    column.sort((a, b) => a.importance - b.importance);
  });

  return columns;
}
