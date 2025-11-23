import React from "react";
import { render, screen } from "@testing-library/react";
import PlatformHeader from "../PlatformHeader";

describe("PlatformHeader", () => {
  test("renders platform name with proper accessibility attributes", () => {
    const platformName = "Platform 3";

    render(<PlatformHeader platformName={platformName} />);

    // Check for heading role and proper aria attributes
    const platformHeader = screen.getByRole("heading", { level: 3 });
    expect(platformHeader).toBeInTheDocument();
    expect(platformHeader).toHaveAttribute(
      "aria-label",
      "Platform section: Platform 3",
    );

    // Check that the platform name is displayed
    expect(screen.getByText("Platform 3")).toBeInTheDocument();
  });
});
