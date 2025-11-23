import { render, screen } from "@testing-library/react";
import Checkbox from "../Checkbox";

describe("Checkbox", () => {
  it("renders checkbox with correct label and accessibility attributes", () => {
    const mockOnChange = jest.fn();

    render(
      <Checkbox
        id="test-checkbox"
        checked={true}
        onChange={mockOnChange}
        label="Enable notifications"
      />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Enable notifications",
    });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute("aria-describedby", "test-checkbox-label");

    const label = screen.getByText("Enable notifications");
    expect(label).toHaveAttribute("id", "test-checkbox-label");
  });
});
