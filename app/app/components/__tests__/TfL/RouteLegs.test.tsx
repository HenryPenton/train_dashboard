import { render, screen } from "@testing-library/react";
import RouteLegs from "../../TfL/RouteLegs";

describe("RouteLegs", () => {
  it("renders journey legs with correct aria-labels", () => {
    const route = [
      "tube: Oxford Circus to Green Park",
      "walk: Green Park to Piccadilly Circus",
    ];
    render(<RouteLegs route={route} />);
    expect(screen.getByLabelText("Journey leg 1")).toHaveTextContent(
      "tube: Oxford Circus to Green Park",
    );
    expect(screen.getByLabelText("Journey leg 2")).toHaveTextContent(
      "walk: Green Park to Piccadilly Circus",
    );
  });

  it("renders default color when method does not match colorMap", () => {
    const route = ["unknown: Some Place to Another Place"];
    render(<RouteLegs route={route} />);
    const methodSpan = screen
      .getByLabelText("Journey leg 1")
      .querySelector("span");
    expect(methodSpan).toHaveClass("text-lg", "font-bold", "text-cyan-300");
    expect(screen.getByLabelText("Journey leg 1")).toHaveTextContent(
      "unknown: Some Place to Another Place",
    );
  });
  it("renders correct text and method when there is no match (no colon)", () => {
    const route = ["Just a freeform string with no colon"]; // no method:rest pattern
    render(<RouteLegs route={route} />);
    const leg = screen.getByLabelText("Journey leg 1");
    // Should not render a method span, only the rest
    expect(leg.querySelector("span.text-lg")).toBeNull();
    expect(leg).toHaveTextContent("Just a freeform string with no colon");
  });
});
