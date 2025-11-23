import { render, screen } from "@testing-library/react";
import Loading from "../Loading";

describe("Loading", () => {
  it("renders loading indicator with proper accessibility attributes and default message", () => {
    render(<Loading />);

    // Check that the loading status is properly labeled
    const loadingStatus = screen.getByRole("status", { name: "Loading..." });
    expect(loadingStatus).toBeInTheDocument();

    // Check that the message is present and has aria-live attribute
    const messageElement = screen.getByText("Loading...");
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveAttribute("aria-live", "polite");

    // Check that the spinner is hidden from screen readers
    const spinner = loadingStatus.querySelector('[aria-hidden="true"]');
    expect(spinner).toBeInTheDocument();
  });

  it("renders loading indicator with custom message", () => {
    const customMessage = "Fetching train data...";

    render(<Loading message={customMessage} />);

    // Check that the loading status uses the custom message
    const loadingStatus = screen.getByRole("status", { name: customMessage });
    expect(loadingStatus).toBeInTheDocument();

    // Check that the custom message is displayed
    const messageElement = screen.getByText(customMessage);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveAttribute("aria-live", "polite");
  });
});
