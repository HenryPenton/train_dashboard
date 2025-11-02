import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LastRefreshed from "../text/LastRefreshed";

describe("LastRefreshed", () => {
  it("renders the correct last refreshed time", () => {
    const mockDate = new Date("2025-10-17T12:34:56");
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    render(<LastRefreshed />);
    // The output format is HH:MM:SS, so check for 12:34:56
    expect(screen.getByText(/last refreshed: 12:34:56/i)).toBeInTheDocument();
    jest.restoreAllMocks();
  });
});
