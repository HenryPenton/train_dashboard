import { render, screen } from "@testing-library/react";
import DepartureListItem from "../../RailDepartures/DepartureListItem";

describe("DepartureListItem", () => {
  it("renders departure item details", () => {
    const departure = {
      url: "#",
      origin: "A",
      destination: "B",
      actual: "10:00",
      platform: "1",
      delay: 0,
      status: "On time" as const,
    };
    render(<DepartureListItem dep={departure} />);
    expect(screen.getByText(/A/)).toBeInTheDocument();
    expect(screen.getByText(/B/)).toBeInTheDocument();
    expect(screen.getByText(/10:00/)).toBeInTheDocument();
  });
});
