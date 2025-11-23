import React from "react";
import { render, screen } from "@testing-library/react";
import PlatformInfo from "../PlatformInfo";

describe("PlatformInfo", () => {
  test("renders platform information with proper accessibility", () => {
    const platform = "5A";

    render(<PlatformInfo platform={platform} />);

    // Check for the aria-label attribute
    const platformInfo = screen.getByLabelText("Departing from platform 5A");
    expect(platformInfo).toBeInTheDocument();

    // Check that both the label and platform number are displayed
    expect(screen.getByText("Platform:")).toBeInTheDocument();
    expect(screen.getByText("5A")).toBeInTheDocument();
  });
});
