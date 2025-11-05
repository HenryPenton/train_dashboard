import { render, screen } from "@testing-library/react";
import DepartureError from "../../RailDepartures/DepartureError";

describe("DepartureError", () => {
  it("renders error message", () => {
    render(<DepartureError message="Something went wrong" />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
