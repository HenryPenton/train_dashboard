import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SaveActions from "./SaveActions";

describe("SaveActions", () => {
  test("shows success message when saveSuccess is true", () => {
    const onSave = jest.fn();
    render(
      <SaveActions
        saveSuccess={true}
        saveError={null}
        hasUnsavedChanges={true}
        isLoading={false}
        onSave={onSave}
      />,
    );

    expect(screen.getByText(/Success:/)).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /Save Schedules/i });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(onSave).toHaveBeenCalled();
  });

  test("shows error message and disables button when loading or no changes", () => {
    const onSave = jest.fn();
    render(
      <SaveActions
        saveSuccess={false}
        saveError={"Network error"}
        hasUnsavedChanges={false}
        isLoading={true}
        onSave={onSave}
      />,
    );

    expect(screen.getByText(/Error:/)).toBeInTheDocument();
    const button = screen.getByRole("button", {
      name: /Saving...|Save Schedules/i,
    });
    expect(button).toBeDisabled();
  });
});
