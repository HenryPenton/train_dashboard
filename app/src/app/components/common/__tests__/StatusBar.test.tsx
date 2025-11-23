import { render, screen } from "@testing-library/react";
import StatusBar from "../StatusBar";

describe("StatusBar", () => {
  it("renders status indicator with correct accessibility attributes", () => {
    render(<StatusBar backgroundColor="bg-blue-500" />);

    const statusBar = screen.getByRole("status", {
      name: "Status indicator",
    });

    expect(statusBar).toBeInTheDocument();
    expect(statusBar).toHaveClass("bg-blue-500");
    expect(statusBar).toHaveAttribute("aria-live", "polite");
  });

  it("applies the correct background color class", () => {
    render(<StatusBar backgroundColor="bg-red-400" />);

    const statusBar = screen.getByRole("status");
    expect(statusBar).toHaveClass("bg-red-400");
  });
});