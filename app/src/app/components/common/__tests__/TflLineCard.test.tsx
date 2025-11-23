import { render, screen } from "@testing-library/react";
import TflLineCard from "../TflLineCard";

describe("TflLineCard", () => {
  it("renders line card with correct accessibility attributes and structure", () => {
    render(
      <TflLineCard lineName="Central Line">
        <div>Mock arrival 1</div>
        <div>Mock arrival 2</div>
      </TflLineCard>,
    );

    // Check region with proper aria-labelledby
    const lineRegion = screen.getByRole("region", {
      name: "Central Line",
    });
    expect(lineRegion).toBeInTheDocument();

    // Check heading with correct id
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Central Line");
    expect(heading).toHaveAttribute("id", "line-central-line-heading");

    // Check arrivals list
    const arrivalsList = screen.getByRole("list", {
      name: "Central Line arrivals",
    });
    expect(arrivalsList).toBeInTheDocument();

    // Check children are rendered
    expect(screen.getByText("Mock arrival 1")).toBeInTheDocument();
    expect(screen.getByText("Mock arrival 2")).toBeInTheDocument();
  });

  it("handles line names with spaces correctly in ID generation", () => {
    render(
      <TflLineCard lineName="Northern Line">
        <div>Test content</div>
      </TflLineCard>,
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "line-northern-line-heading");

    // Check region is properly labeled by the heading
    const region = screen.getByRole("region", { name: "Northern Line" });
    expect(region).toHaveAttribute(
      "aria-labelledby",
      "line-northern-line-heading",
    );
  });

  it("handles complex line names with multiple spaces correctly", () => {
    render(
      <TflLineCard lineName="District Line East">
        <div>Test content</div>
      </TflLineCard>,
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "line-district-line-east-heading");
    expect(heading).toHaveTextContent("District Line East");
  });

  it("renders empty arrivals list when no children provided", () => {
    render(<TflLineCard lineName="Piccadilly Line">{null}</TflLineCard>);

    const arrivalsList = screen.getByRole("list", {
      name: "Piccadilly Line arrivals",
    });
    expect(arrivalsList).toBeInTheDocument();
    expect(arrivalsList).toBeEmptyDOMElement();
  });
});
