import { render, screen, fireEvent } from "@testing-library/react";
import InputField from "../InputField";

describe("InputField", () => {
  it("renders input field with proper label association and accessibility attributes", () => {
    const mockOnChange = jest.fn();
    const testLabel = "Test Label";
    const testValue = "test value";
    const testPlaceholder = "Enter text here";
    
    render(
      <InputField
        label={testLabel}
        value={testValue}
        onChange={mockOnChange}
        placeholder={testPlaceholder}
        required={true}
      />
    );

    // Check that the input is properly labeled and accessible
    const input = screen.getByRole("textbox", { name: testLabel });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(testValue);
    expect(input).toHaveAttribute("placeholder", testPlaceholder);
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toBeRequired();
    
    // Check that the label is properly associated
    const label = screen.getByText(testLabel);
    expect(label).toBeInTheDocument();
    
    // Check required indicator
    const requiredIndicator = screen.getByLabelText("required");
    expect(requiredIndicator).toBeInTheDocument();
    
    // Test onChange functionality
    fireEvent.change(input, { target: { value: "new value" } });
    expect(mockOnChange).toHaveBeenCalled();
  });
});