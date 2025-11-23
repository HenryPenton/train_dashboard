import { render, screen } from "@testing-library/react";
import TflArrivalCard from "../TflArrivalCard";

const mockArrival = {
  id: "test-arrival-1",
  lineId: "central",
  lineName: "Central",
  platformName: "Platform 1",
  timeToStation: 180,
  expectedArrival: "2024-01-01T12:03:00Z",
  towards: "Ealing Broadway",
  currentLocation: "Oxford Circus",
  destinationName: "Ealing Broadway",
  direction: "westbound",
};

const mockFormatTimeToStation = (seconds: number): string => {
  if (seconds < 60) return "Due";
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

describe("TflArrivalCard", () => {
  it("renders arrival card with correct accessibility attributes and content", () => {
    render(
      <TflArrivalCard
        arrival={mockArrival}
        formatTimeToStation={mockFormatTimeToStation}
      />,
    );

    // Check main container with aria-label
    const arrivalCard = screen.getByRole("listitem", {
      name: "Train to Ealing Broadway, arriving in 3 min",
    });
    expect(arrivalCard).toBeInTheDocument();

    // Check destination information
    const destination = screen.getByLabelText("Destination");
    expect(destination).toHaveTextContent("to Ealing Broadway");

    // Check current location
    const currentLocation = screen.getByLabelText("Current location");
    expect(currentLocation).toHaveTextContent("Oxford Circus");

    // Check arrival time with live region
    const arrivalTime = screen.getByRole("status", {
      name: "Arrival time",
    });
    expect(arrivalTime).toHaveTextContent("3 min");
    expect(arrivalTime).toHaveAttribute("aria-live", "polite");
  });

  it("renders arrival card without current location when not provided", () => {
    const arrivalWithoutLocation = {
      ...mockArrival,
      currentLocation: undefined,
    };

    render(
      <TflArrivalCard
        arrival={arrivalWithoutLocation}
        formatTimeToStation={mockFormatTimeToStation}
      />,
    );

    // Should not find current location element
    expect(screen.queryByLabelText("Current location")).not.toBeInTheDocument();

    // But should still have destination and arrival time
    expect(screen.getByLabelText("Destination")).toHaveTextContent(
      "to Ealing Broadway",
    );
    expect(screen.getByLabelText("Arrival time")).toHaveTextContent("3 min");
  });

  it("displays 'Due' for arrivals under 60 seconds", () => {
    const dueArrival = { ...mockArrival, timeToStation: 30 };

    render(
      <TflArrivalCard
        arrival={dueArrival}
        formatTimeToStation={mockFormatTimeToStation}
      />,
    );

    expect(screen.getByLabelText("Arrival time")).toHaveTextContent("Due");
  });
});
