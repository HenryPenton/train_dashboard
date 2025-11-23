import React from "react";
import { render, screen } from "@testing-library/react";
import RouteSteps from "../RouteSteps";
import { RouteLeg } from "../../../types/route";

// Mock the RouteStep component to focus on RouteSteps testing
jest.mock("../RouteStep", () => {
  return function MockRouteStep({
    leg,
    stepNumber,
    isLast,
  }: {
    leg: RouteLeg;
    stepNumber: number;
    isLast: boolean;
  }) {
    return (
      <div data-testid={`route-step-${stepNumber}`}>
        Step {stepNumber}: {leg.mode} from {leg.departure} to {leg.arrival}{" "}
        {isLast ? "(last)" : ""}
      </div>
    );
  };
});

describe("RouteSteps", () => {
  const mockRouteLegs: RouteLeg[] = [
    {
      mode: "walking",
      instruction: "Walk to bus stop",
      departure: "Home",
      arrival: "Bus Stop A",
      line: "",
    },
    {
      mode: "bus",
      instruction: "Take Bus 25",
      departure: "Bus Stop A",
      arrival: "Oxford Circus",
      line: "Bus 25",
    },
    {
      mode: "tube",
      instruction: "Take Central Line",
      departure: "Oxford Circus",
      arrival: "Liverpool Street",
      line: "Central Line",
    },
  ];

  it("renders route steps with proper accessibility attributes and content", () => {
    render(<RouteSteps legs={mockRouteLegs} />);

    // Check for the main region with proper ARIA label
    const journeyRegion = screen.getByRole("region", {
      name: "Journey steps breakdown",
    });
    expect(journeyRegion).toBeInTheDocument();

    // Check for the heading
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Journey Steps");

    // Check that the emoji is properly hidden from screen readers
    const emoji = screen.getByText("🗺️");
    expect(emoji).toHaveAttribute("aria-hidden", "true");

    // Check for the steps list with proper ARIA attributes
    const stepsList = screen.getByRole("list", {
      name: "Journey with 3 steps",
    });
    expect(stepsList).toBeInTheDocument();

    // Check that the step count badge is displayed
    expect(screen.getByText("3 steps")).toBeInTheDocument();

    // Check that all RouteStep components are rendered
    expect(screen.getByTestId("route-step-1")).toBeInTheDocument();
    expect(screen.getByTestId("route-step-2")).toBeInTheDocument();
    expect(screen.getByTestId("route-step-3")).toBeInTheDocument();

    // Verify the last step is marked correctly
    expect(
      screen.getByText(
        "Step 3: tube from Oxford Circus to Liverpool Street (last)",
      ),
    ).toBeInTheDocument();
  });

  it("renders with single step correctly", () => {
    const singleLeg: RouteLeg[] = [mockRouteLegs[0]];

    render(<RouteSteps legs={singleLeg} />);

    const stepsList = screen.getByRole("list", {
      name: "Journey with 1 steps",
    });
    expect(stepsList).toBeInTheDocument();

    expect(screen.getByText("1 steps")).toBeInTheDocument();
    expect(screen.getByTestId("route-step-1")).toBeInTheDocument();
  });

  it("renders empty steps array correctly", () => {
    render(<RouteSteps legs={[]} />);

    const journeyRegion = screen.getByRole("region", {
      name: "Journey steps breakdown",
    });
    expect(journeyRegion).toBeInTheDocument();

    const stepsList = screen.getByRole("list", {
      name: "Journey with 0 steps",
    });
    expect(stepsList).toBeInTheDocument();

    expect(screen.getByText("0 steps")).toBeInTheDocument();
  });

  it("renders heading with proper semantic structure", () => {
    render(<RouteSteps legs={mockRouteLegs} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Journey Steps");

    // The heading should be properly nested within the region
    const journeyRegion = screen.getByRole("region", {
      name: "Journey steps breakdown",
    });
    expect(journeyRegion).toContainElement(heading);
  });
});
