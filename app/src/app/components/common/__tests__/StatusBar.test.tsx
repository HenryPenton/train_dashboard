import { render, screen } from "@testing-library/react";
import StatusBar from "../StatusBar";

describe("StatusBar", () => {
  it("renders loading status bar with correct accessibility attributes", () => {
    render(<StatusBar backgroundColor="bg-blue-500" />);

    const statusBar = screen.getByRole("progressbar", {
      name: "Loading status indicator",
    });

    expect(statusBar).toBeInTheDocument();
    expect(statusBar).toHaveClass("bg-blue-500");
    expect(statusBar).toHaveAttribute("aria-valuetext", "Loading in progress");
  });

  it("applies the correct background color class", () => {
    render(<StatusBar backgroundColor="bg-red-400" />);

    const statusBar = screen.getByRole("progressbar");
    expect(statusBar).toHaveClass("bg-red-400");
  });
});