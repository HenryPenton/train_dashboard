import { render, screen } from "@testing-library/react";
import DepartureList from "../../RailDepartures/DepartureList";

describe("DepartureList", () => {
    it("renders a list when departures are present", () => {
      const departures = [
        {
          url: "#",
          origin: "A",
          destination: "B",
          actual: "10:00",
          platform: "1",
          delay: 0,
          status: "On time" as const,
        },
        {
          url: "#",
          origin: "C",
          destination: "D",
          actual: "11:00",
          platform: "2",
          delay: 5,
          status: "Late" as const,
        },
      ];
      render(<DepartureList departures={departures} />);
      // Check for a list element
      expect(screen.getByRole("list")).toBeInTheDocument();
      // Optionally check for items
      expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
    });

    it("renders no list when departures is empty", () => {
      render(<DepartureList departures={[]} />);
      // Should not find a list
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
      // Optionally check for a message
      expect(screen.getByText(/no departures/i)).toBeInTheDocument();
    });
});
