import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DaySelector, { parseDays, joinDays } from "./DaySelector";

describe("DaySelector", () => {
  test("renders role=group with label and individual day checkboxes", () => {
    const onChange = jest.fn();
    render(<DaySelector selectedDays={"mon,tue"} onChange={onChange} />);

    // role=group should be labelled by the visible label
    const group = screen.getByRole("group", { name: /Days of Week/i });
    expect(group).toBeInTheDocument();

    // Each day's checkbox uses an aria-label like "Mon - selected"
    expect(screen.getByLabelText("Mon - selected")).toBeChecked();
    expect(screen.getByLabelText("Tue - selected")).toBeChecked();
    expect(screen.getByLabelText("Wed - not selected")).not.toBeChecked();
  });

  test("clicking a day toggles its selection and calls onChange with joined days", () => {
    const onChange = jest.fn();
    render(<DaySelector selectedDays={"mon"} onChange={onChange} />);

    const tueCheckbox = screen.getByLabelText("Tue - not selected");
    fireEvent.click(tueCheckbox);

    expect(onChange).toHaveBeenCalled();
    // Expect new string to contain both mon and tue (order preserved by implementation)
    expect(onChange.mock.calls[0][0]).toMatch(/mon/);
    expect(onChange.mock.calls[0][0]).toMatch(/tue/);
  });

  test("utility parseDays and joinDays behave as expected", () => {
    expect(parseDays("")).toEqual([]);
    expect(parseDays("mon,tue")).toEqual(["mon", "tue"]);
    expect(joinDays(["wed", "thu"]).includes("wed")).toBe(true);
  });
});
