import { render, screen } from "@testing-library/react";
import TrainDepartures from "../departures/TrainDepartures";

const mockProps = {
  fromStation: { stationName: "Paddington", stationCode: "PAD" },
  toStation: { stationName: "Liverpool Street", stationCode: "LST" },
};

const mockDepartures = [
  {
    origin: "Paddington",
    destination: "Liverpool Street",
    actual: "10:30",
    platform: "2",
    delay: 0,
    status: "On time",
  },
  {
    origin: "Paddington",
    destination: "Liverpool Street",
    actual: "10:45",
    platform: "3",
    delay: 5,
    status: "Late",
  },
];

describe("TrainDepartures accessibility happy path", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockDepartures,
    });
  });

  it("renders departures", async () => {
    render(<TrainDepartures {...mockProps} />);

    // Wait for departures to load using aria-label selectors
    const list = await screen.findByRole("list", { name: /Departure list/i });
    expect(list).toBeInTheDocument();

    // Find list items by aria-label
    const depItems = await screen.findAllByLabelText(/Departure from Paddington to Liverpool Street/);
    expect(depItems.length).toBe(2);

    // Find delay elements by aria-label
    expect(screen.getByLabelText("Delay: On time")).toBeInTheDocument();
    expect(screen.getByLabelText("Delay: 5 min")).toBeInTheDocument();

    // Find status elements by aria-label
    expect(screen.getByLabelText("On time departure")).toBeInTheDocument();
    expect(screen.getByLabelText("Late departure")).toBeInTheDocument();
  });
});

describe("TrainDepartures error state", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockRejectedValue(new Error("API error"));
  });

  it("shows an error message when fetch fails", async () => {
    render(<TrainDepartures {...mockProps} />);
    const error = await screen.findByRole("alert", { name: /Departure error/i });
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent("Could not find any services for the configured route.");
  });
});
