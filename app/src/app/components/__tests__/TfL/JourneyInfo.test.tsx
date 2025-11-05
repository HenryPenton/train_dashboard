import { render, screen } from "@testing-library/react";
import JourneyInfo from "../../TfL/JourneyInfo";

describe("JourneyInfo", () => {
  it("renders journey info with correct labels", () => {
    render(
      <JourneyInfo
        from="A"
        to="B"
        duration={42}
        arrival={new Date("2025-11-02T12:34:00Z").toISOString()}
        fare={1234}
      />,
    );
    expect(screen.getByLabelText(/origin/i)).toHaveTextContent("A");
    expect(screen.getByLabelText(/destination/i)).toHaveTextContent("B");
    expect(
      screen.getByLabelText(/journey duration and arrival/i),
    ).toHaveTextContent("42 min");
    expect(
      screen.getByLabelText(/journey duration and arrival/i),
    ).toHaveTextContent("Arrival:");
    expect(
      screen.getByLabelText(/journey duration and arrival/i),
    ).toHaveTextContent("Fare:");
  });
});
