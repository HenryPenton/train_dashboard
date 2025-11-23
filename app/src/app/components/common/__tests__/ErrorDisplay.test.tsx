import { render, screen } from "@testing-library/react";
import ErrorDisplay from "../ErrorDisplay";

describe("ErrorDisplay", () => {
  it("renders error message with proper accessibility attributes", () => {
    const errorMessage = "Something went wrong";

    render(<ErrorDisplay message={errorMessage} />);

    const errorAlert = screen.getByRole("alert", {
      name: `Error message: ${errorMessage}`,
    });

    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(`Error: ${errorMessage}`);

    // Check that the warning emoji is properly hidden from screen readers
    const warningIcon = screen.getByText("⚠️");
    expect(warningIcon).toHaveAttribute("aria-hidden", "true");
  });
});
