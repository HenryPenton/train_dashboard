import { buildConfigItems, groupAndSortItems } from "../groupAndSortItems";
import type { ConfigType } from "../../stores/config";

const pos = (c2: number, c3: number, importance: number) => ({
  col_2_position: c2,
  col_3_position: c3,
  importance,
});

const config: ConfigType = {
  refresh_timer: 60,
  theme: "dark",
  rail_departures: [
    {
      origin: "A",
      originCode: "A",
      destination: "B",
      destinationCode: "B",
      ...pos(2, 3, 1),
    },
  ],
  tfl_best_routes: [
    {
      origin: "C",
      originNaPTANOrATCO: "c",
      destination: "D",
      destinationNaPTANOrATCO: "d",
      ...pos(1, 1, 5),
    },
  ],
  tube_departures: [{ stationName: "S", stationId: "s", ...pos(1, 2, 2) }],
  tfl_line_status: { enabled: true, ...pos(1, 1, 1) },
};

describe("groupAndSortItems", () => {
  it("returns no items for null config and omits disabled line status", () => {
    expect(buildConfigItems(null)).toEqual([]);
    const items = buildConfigItems({
      ...config,
      tfl_line_status: { ...config.tfl_line_status, enabled: false },
    });
    expect(items.map((i) => i.type)).not.toContain("tfl_line_status");
  });

  it("puts everything in one column sorted by importance", () => {
    const [col] = groupAndSortItems(buildConfigItems(config), 1);
    expect(col.map((i) => i.importance)).toEqual([1, 1, 2, 5]);
  });

  it("uses column positions for 2 and 3 columns", () => {
    const items = buildConfigItems(config);
    const two = groupAndSortItems(items, 2);
    expect(two[1].map((i) => i.type)).toEqual(["rail_departure"]);
    expect(two[0]).toHaveLength(3);
    const three = groupAndSortItems(items, 3);
    expect(three[2].map((i) => i.type)).toEqual(["rail_departure"]);
    expect(three[1].map((i) => i.type)).toEqual(["tube_departure"]);
  });
});
