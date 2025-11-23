import { render, screen } from "@testing-library/react";
import Button from "../Button";

describe("Button", () => {
  it("renders button with correct text and accessibility attributes", () => {
    render(
      <Button variant="primary" aria-label="Primary action button">
        Click me
      </Button>,
    );

    const button = screen.getByRole("button", {
      name: "Primary action button",
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
  });
});
