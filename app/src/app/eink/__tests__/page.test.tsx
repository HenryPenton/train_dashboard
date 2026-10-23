import { render, screen, waitFor } from "@testing-library/react";
import EinkPage from "../page";
import { useConfigStore } from "../../providers/config";

jest.mock("../../providers/config");
jest.mock("../../components/eink/EinkDepartures", () => ({
  __esModule: true,
  default: () => <div>departures-section</div>,
}));
jest.mock("../../components/eink/EinkLineStatus", () => ({
  __esModule: true,
  default: () => <div>line-status-section</div>,
}));

const mockUseConfigStore = useConfigStore as jest.Mock;

const baseConfig = {
  tfl_best_routes: [],
  rail_departures: [
    {
      origin: "A",
      originCode: "AAA",
      destination: "B",
      destinationCode: "BBB",
      col_2_position: 1,
      col_3_position: 1,
      importance: 2,
    },
  ],
  tube_departures: [],
  tfl_line_status: {
    enabled: true,
    col_2_position: 1,
    col_3_position: 1,
    importance: 1,
  },
  refresh_timer: 10,
};

function setup(config: typeof baseConfig) {
  const fetchConfig = jest.fn().mockResolvedValue(undefined);
  mockUseConfigStore.mockImplementation((selector: (s: unknown) => unknown) =>
    selector({ config, fetchConfig, lastRefreshTimeStamp: "" }),
  );
  return fetchConfig;
}

describe("EinkPage", () => {
  it("renders sections in importance order with a clamped refresh interval", async () => {
    setup(baseConfig);
    const { container } = render(<EinkPage />);
    await waitFor(() =>
      expect(screen.getByText("departures-section")).toBeInTheDocument(),
    );
    const text = container.textContent ?? "";
    expect(text.indexOf("line-status-section")).toBeLessThan(
      text.indexOf("departures-section"),
    );
    // refresh_timer of 10s is clamped to the 60s minimum
    expect(screen.getByText(/Refreshes every 60s/)).toBeInTheDocument();
  });

  it("shows an empty message when nothing is configured", async () => {
    setup({
      ...baseConfig,
      rail_departures: [],
      tfl_line_status: { ...baseConfig.tfl_line_status, enabled: false },
    });
    render(<EinkPage />);
    await waitFor(() =>
      expect(screen.getByText(/Nothing configured yet/)).toBeInTheDocument(),
    );
  });
});
