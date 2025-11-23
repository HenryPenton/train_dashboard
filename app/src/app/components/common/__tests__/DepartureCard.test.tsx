import { render, screen } from "@testing-library/react";
import DepartureCard from "../DepartureCard";
import { Departure } from "../../sections/TrainDepartures";

// Mock the color mapping utility
jest.mock("../../../utils/colorMappings", () => ({
  getDepartureStatusBarColor: jest.fn(() => "bg-green-500"),
}));

describe("DepartureCard", () => {
  const mockDeparture: Departure = {
    scheduledDepartureTime: "14:30",
    estimatedDepartureTime: "14:32",
    status: "Late" as const,
    platform: "3",
    serviceId: "GW123",
    origin: "London Paddington",
    destination: "Bristol Temple Meads",
    delay: 2,
  };

  it("renders departure card with correct information and accessibility attributes", () => {
    render(<DepartureCard departure={mockDeparture} />);

    const departureCard = screen.getByRole("article", {
      name: "Train departure: service departing at 14:30, status: Late",
    });
    expect(departureCard).toBeInTheDocument();

    const departureTime = screen.getByRole("time", {
      name: "Departure time: 14:30",
    });
    expect(departureTime).toBeInTheDocument();

    const delayInfo = screen.getByRole("status", {
      name: "Train delay information: 2 minutes delayed",
    });
    expect(delayInfo).toBeInTheDocument();

    const platformInfo = screen.getByLabelText("Departing from platform 3");
    expect(platformInfo).toBeInTheDocument();
  });
});
