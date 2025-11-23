import React from "react";
import { render, screen } from "@testing-library/react";
import RouteStep from "../RouteStep";
import { RouteLeg } from "../../../types/route";

// Mock the color mappings utilities
jest.mock("../../../utils/colorMappings", () => ({
  getSeverityTextColor: jest.fn(() => "text-green-500"),
  getSeverityBorderColor: jest.fn(() => "border-green-500"),
}));

describe("RouteStep", () => {
  const mockRouteLeg: RouteLeg = {
    mode: "tube",
    instruction: "Take the Central Line",
    departure: "Oxford Circus",
    arrival: "Liverpool Street",
    line: "Central Line",
  };

  it("renders route step with proper accessibility attributes and content", () => {
    render(<RouteStep leg={mockRouteLeg} stepNumber={1} isLast={false} />);

    // Check for the main step item with proper ARIA attributes
    const stepItem = screen.getByRole("listitem", {
      name: "Step 1: tube from Oxford Circus to Liverpool Street",
    });
    expect(stepItem).toBeInTheDocument();

    // Check for step number with proper ARIA label
    const stepNumber = screen.getByLabelText("Step 1");
    expect(stepNumber).toBeInTheDocument();
    expect(stepNumber).toHaveTextContent("1");

    // Check for mode display (text is lowercase in DOM, capitalized by CSS)
    expect(screen.getByText("tube")).toBeInTheDocument();

    // Check for line information
    expect(screen.getByText("Central Line")).toBeInTheDocument();

    // Check for departure station with ARIA label
    const departureStation = screen.getByLabelText("Departure station: Oxford Circus");
    expect(departureStation).toBeInTheDocument();
    expect(departureStation).toHaveTextContent("Oxford Circus");

    // Check for arrival station with ARIA label
    const arrivalStation = screen.getByLabelText("Arrival station: Liverpool Street");
    expect(arrivalStation).toBeInTheDocument();
    expect(arrivalStation).toHaveTextContent("Liverpool Street");

    // Check for section labels
    expect(screen.getByText("From")).toBeInTheDocument();
    expect(screen.getByText("To")).toBeInTheDocument();
  });

  it("renders connection line when not the last step", () => {
    const { container } = render(
      <RouteStep leg={mockRouteLeg} stepNumber={1} isLast={false} />
    );

    // Check that connection line is present (gradient div)
    const connectionLine = container.querySelector(".w-1.h-4.bg-gradient-to-b");
    expect(connectionLine).toBeInTheDocument();
  });

  it("does not render connection line when it is the last step", () => {
    const { container } = render(
      <RouteStep leg={mockRouteLeg} stepNumber={1} isLast={true} />
    );

    // Check that connection line is not present
    const connectionLine = container.querySelector(".w-1.h-4.bg-gradient-to-b");
    expect(connectionLine).not.toBeInTheDocument();
  });

  it("handles different transport modes correctly", () => {
    const busLeg: RouteLeg = {
      ...mockRouteLeg,
      mode: "bus",
      line: "Bus 25",
    };

    render(<RouteStep leg={busLeg} stepNumber={2} isLast={false} />);

    const stepItem = screen.getByRole("listitem", {
      name: "Step 2: bus from Oxford Circus to Liverpool Street",
    });
    expect(stepItem).toBeInTheDocument();
    expect(screen.getByText("bus")).toBeInTheDocument();
    expect(screen.getByText("Bus 25")).toBeInTheDocument();
  });

  it("handles modes without line information", () => {
    const walkingLeg: RouteLeg = {
      ...mockRouteLeg,
      mode: "walking",
      line: "",
    };

    render(<RouteStep leg={walkingLeg} stepNumber={3} isLast={true} />);

    // The mode text is processed with replace("-", " ") and capitalized via CSS
    // So "walking" becomes "walking" but appears as "Walking" due to capitalize class
    expect(screen.getByText("walking")).toBeInTheDocument();
    // Line should not be displayed for walking
    expect(screen.queryByText("Central Line")).not.toBeInTheDocument();
  });
});