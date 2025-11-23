import React from "react";
import { render, screen } from "@testing-library/react";
import RouteInfo from "../RouteInfo";

describe("RouteInfo", () => {
  test("renders route information with accessibility features", () => {
    const origin = "Reading";
    const destination = "Oxford";

    render(<RouteInfo origin={origin} destination={destination} />);

    // Check for region role and aria-label
    const routeRegion = screen.getByRole("region", {
      name: "Route from Reading to Oxford",
    });
    expect(routeRegion).toBeInTheDocument();

    // Check that both origin and destination are displayed
    expect(screen.getByText("Reading")).toBeInTheDocument();
    expect(screen.getByText("Oxford")).toBeInTheDocument();

    // Check that the arrow is present and has aria-hidden attribute
    const arrow = screen.getByText("→");
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveAttribute("aria-hidden", "true");

    // Check styling classes
    expect(routeRegion).toHaveClass(
      "mb-2",
      "text-sm",
      "text-cyan-300",
      "font-medium",
    );

    // Check that origin and destination have correct styling
    const originElement = screen.getByText("Reading");
    const destinationElement = screen.getByText("Oxford");
    expect(originElement).toHaveClass("font-bold");
    expect(destinationElement).toHaveClass("font-bold");
  });
});
