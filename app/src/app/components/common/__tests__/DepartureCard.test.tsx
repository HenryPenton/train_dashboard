import { render, screen } from "@testing-library/react";
import DepartureCard from "../DepartureCard";
import { Departure } from "../../sections/TrainDepartures";

// Mock the color mapping utility
jest.mock("../../../utils/colorMappings", () => ({
  getDepartureStatusBarColor: jest.fn(() => "bg-green-500"),
}));

describe("DepartureCard", () => {
  const mockDeparture: Departure = {
    actual: "14:32",
    status: "Late" as const,
    platform: "3",
    origin: "London Paddington",
    destination: "Bristol Temple Meads",
    delay: 2,
    arrival: "14:28",
  };

  it("renders departure card with correct information and accessibility attributes", () => {
    render(<DepartureCard departure={mockDeparture} />);

    const departureCard = screen.getByRole("article", {
      name: "Train departure: service departing at 14:32, status: Late",
    });
    expect(departureCard).toBeInTheDocument();

    const departureTime = screen.getByRole("time", {
      name: "Departure time: 14:32",
    });
    expect(departureTime).toBeInTheDocument();

    const delayInfo = screen.getByRole("status", {
      name: "Train delay information: 2 minutes delayed",
    });
    expect(delayInfo).toBeInTheDocument();

    const platformInfo = screen.getByLabelText("Departing from platform 3");
    expect(platformInfo).toBeInTheDocument();
  });

  it("shows the arrival time in arrival mode", () => {
    render(
      <DepartureCard
        departure={{ ...mockDeparture, arrival: "15:10" }}
        timeDisplay="arrival"
      />,
    );

    expect(
      screen.getByRole("time", { name: "Arrival time: 15:10" }),
    ).toHaveTextContent("Arrives: 15:10");
    expect(screen.getByLabelText("Arriving at platform 3")).toBeInTheDocument();
  });

  it("does not show a starts here badge when the train arrives", () => {
    render(<DepartureCard departure={mockDeparture} />);

    expect(screen.queryByLabelText("Starts here")).not.toBeInTheDocument();
  });

  it("shows a starts here badge and the departure time in arrival mode when the train has no arrival", () => {
    render(
      <DepartureCard
        departure={{ ...mockDeparture, arrival: null }}
        timeDisplay="arrival"
      />,
    );

    expect(screen.getByLabelText("Starts here")).toBeInTheDocument();
    expect(
      screen.getByRole("time", { name: "Departure time: 14:32" }),
    ).toHaveTextContent("Departs: 14:32");
    expect(
      screen.getByLabelText("Departing from platform 3"),
    ).toBeInTheDocument();
  });
});
