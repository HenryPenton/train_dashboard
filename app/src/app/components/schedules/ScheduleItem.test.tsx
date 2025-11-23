import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ScheduleItem, { Schedule } from "./ScheduleItem";

const railSchedule: Schedule = {
  type: "rail_departure",
  day_of_week: "mon,tue",
  time: "09:15",
  from_station_code: "PAD",
  to_station_code: "RDG",
  from_station_name: "London Paddington",
  to_station_name: "Reading",
};

describe("ScheduleItem", () => {
  test("view mode shows days and time and buttons", () => {
    const mock = jest.fn();
    render(
      <ScheduleItem
        schedule={railSchedule}
        isEditing={false}
        onEdit={mock}
        onSaveEdit={mock}
        onCancelEdit={mock}
        onRemove={mock}
        onTimeChange={mock}
        onDaysChange={mock}
      />
    );

    expect(screen.getByText(/MON, TUE|mon, tue/i)).toBeInTheDocument();
    expect(screen.getByText(/09:15/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Remove/i })).toBeInTheDocument();
  });

  test("editing mode shows editable time and day selector and calls save", () => {
    const onEdit = jest.fn();
    const onSaveEdit = jest.fn();
    const onCancelEdit = jest.fn();
    const onTimeChange = jest.fn();
    const onDaysChange = jest.fn();

    render(
      <ScheduleItem
        schedule={railSchedule}
        isEditing={true}
        editingSchedule={railSchedule}
        onEdit={onEdit}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onRemove={jest.fn()}
        onTimeChange={onTimeChange}
        onDaysChange={onDaysChange}
      />
    );

    const timeInput = screen.getByDisplayValue("09:15");
    expect(timeInput).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: /Confirm Changes/i });
    fireEvent.click(confirmButton);
    expect(onSaveEdit).toHaveBeenCalled();
  });
});
