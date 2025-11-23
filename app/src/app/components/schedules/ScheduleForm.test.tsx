import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ScheduleForm from "./ScheduleForm";

const baseSchedule = {
  type: "rail_departure" as const,
  day_of_week: "",
  time: "08:00",
  from_station_name: "",
  from_station_code: "",
  to_station_name: "",
  to_station_code: "",
  from_name: "",
  from_code: "",
  to_name: "",
  to_code: "",
};

describe("ScheduleForm", () => {
  test("renders and submits form, and DaySelector calls onDaysChange", () => {
    const onChange = jest.fn();
    const onDaysChange = jest.fn();
    const onSubmit = jest.fn((e) => e && e.preventDefault());

    const { container } = render(
      <ScheduleForm
        newSchedule={baseSchedule}
        validationError={null}
        onChange={onChange}
        onDaysChange={onDaysChange}
        onSubmit={onSubmit}
      />,
    );

    // Form and DaySelector present
    const addButton = screen.getByRole("button", { name: /Add Schedule/i });
    expect(addButton).toBeInTheDocument();

    const group = screen.getByRole("group", { name: /Days of Week/i });
    expect(group).toBeInTheDocument();

    // Click a day - expect onDaysChange called
    const mon = screen.getByLabelText("Mon - not selected");
    fireEvent.click(mon);
    expect(onDaysChange).toHaveBeenCalled();

    // Submit form by dispatching submit on the form element directly
    const form = container.querySelector("form");
    expect(form).toBeTruthy();
    fireEvent.submit(form as HTMLFormElement);
    expect(onSubmit).toHaveBeenCalled();
  });
});
