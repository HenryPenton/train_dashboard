import React from "react";
import { render, screen } from "@testing-library/react";
import SchedulesList from "./SchedulesList";

const sample = {
  schedules: [
    {
      type: "tube_line_status" as const,
      day_of_week: "wed",
      time: "12:00",
    },
  ],
};

describe("SchedulesList", () => {
  test("shows empty state when no schedules", () => {
    render(
      <SchedulesList
        schedules={{ schedules: [] }}
        editingScheduleIndex={null}
        editingSchedule={null}
        validationError={null}
        onEditSchedule={jest.fn()}
        onSaveEdit={jest.fn()}
        onCancelEdit={jest.fn()}
        onRemoveSchedule={jest.fn()}
        onTimeChange={jest.fn()}
        onDaysChange={jest.fn()}
      />,
    );

    expect(screen.getByText(/No schedules configured/i)).toBeInTheDocument();
  });

  test("renders list of schedules", () => {
    render(
      <SchedulesList
        schedules={sample}
        editingScheduleIndex={null}
        editingSchedule={null}
        validationError={null}
        onEditSchedule={jest.fn()}
        onSaveEdit={jest.fn()}
        onCancelEdit={jest.fn()}
        onRemoveSchedule={jest.fn()}
        onTimeChange={jest.fn()}
        onDaysChange={jest.fn()}
      />,
    );

    expect(
      screen.getByText(/TfL Line Status Overview|TUBE_LINE_STATUS/i),
    ).toBeInTheDocument();
  });
});
