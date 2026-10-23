import { render, screen } from "@testing-library/react";
import DepartureTime from "../DepartureTime";

describe("DepartureTime", () => {
  it("renders scheduled departure time with accessibility attributes", () => {
    render(<DepartureTime status="On time" time="14:30" />);

    const departureTime = screen.getByRole("time", {
      name: "Departure time: 14:30",
    });
    expect(departureTime).toBeInTheDocument();
    expect(departureTime).toHaveTextContent("Departs: 14:30");
  });

  it("renders cancelled status correctly", () => {
    render(<DepartureTime status="Cancelled" time="14:30" />);

    const departureTime = screen.getByRole("time", {
      name: "Departure time: Cancelled",
    });
    expect(departureTime).toBeInTheDocument();
    expect(screen.getByText("CANCELLED")).toBeInTheDocument();
  });

  it("renders arrival wording and label in arrival mode", () => {
    render(
      <DepartureTime status="On time" time="14:52" timeDisplay="arrival" />,
    );

    const arrivalTime = screen.getByRole("time", {
      name: "Arrival time: 14:52",
    });
    expect(arrivalTime).toHaveTextContent("Arrives: 14:52");
  });
});
