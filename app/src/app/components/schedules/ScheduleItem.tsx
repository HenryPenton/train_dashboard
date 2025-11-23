import React from "react";
import Button from "../common/Button";
import DaySelector, { parseDays } from "../common/DaySelector";

export type Schedule = {
  day_of_week: string;
  time: string;
} & (
  | {
      type: "rail_departure";
      from_station_code: string;
      to_station_code: string;
      from_station_name: string;
      to_station_name: string;
    }
  | {
      type: "tube_line_status";
    }
  | {
      type: "best_route";
      from_code: string;
      to_code: string;
      from_name: string;
      to_name: string;
    }
);

interface ScheduleItemProps {
  schedule: Schedule;
  isEditing: boolean;
  editingSchedule?: Schedule;
  onEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemove: () => void;
  onDuplicate?: () => void;
  onTimeChange: (time: string) => void;
  onDaysChange: (days: string) => void;
  disabled?: boolean;
}

export default function ScheduleItem({
  schedule,
  isEditing,
  editingSchedule,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onRemove,
  onDuplicate,
  onTimeChange,
  onDaysChange,
  disabled = false,
}: ScheduleItemProps) {
  const getScheduleIcon = (type: Schedule["type"]) => {
    switch (type) {
      case "rail_departure":
        return "🚂";
      case "tube_line_status":
        return "🚇";
      case "best_route":
        return "⭐";
      default:
        return "📅";
    }
  };

  const getScheduleDescription = (schedule: Schedule) => {
    switch (schedule.type) {
      case "rail_departure":
        return `From ${schedule.from_station_name} to ${schedule.to_station_name}`;
      case "best_route":
        return `From ${schedule.from_name} to ${schedule.to_name}`;
      case "tube_line_status":
        return "TfL Line Status Overview";
      default:
        return "";
    }
  };

  if (isEditing && editingSchedule) {
    return (
      <div className="p-4 bg-[#2a2d35] rounded border-l-4 border-cyan-500">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getScheduleIcon(schedule.type)}</span>
            <span className="font-semibold text-cyan-200">
              {schedule.type.replace("_", " ").toUpperCase()}
            </span>
          </div>

          {/* Editable time */}
          <div className="flex flex-col gap-1">
            <label className="text-cyan-300 font-semibold">
              Time (24-hour format)
              <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="time"
              value={editingSchedule.time}
              onChange={(e) => onTimeChange(e.target.value)}
              required
              className="bg-[#1a1d25] border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none max-w-xs"
            />
          </div>

          {/* Editable days */}
          <DaySelector
            selectedDays={editingSchedule.day_of_week}
            onChange={onDaysChange}
          />

          {/* Station/Place info (read-only) */}
          <div className="text-gray-300">
            {getScheduleDescription(schedule)}
          </div>

          {/* Edit mode buttons */}
          <div className="flex gap-2">
            <Button variant="success" onClick={onSaveEdit}>
              Confirm Changes
            </Button>
            <Button variant="secondary" onClick={onCancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div className="p-4 bg-[#2a2d35] rounded border-l-4 border-cyan-500">
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getScheduleIcon(schedule.type)}</span>
          <span className="font-semibold text-cyan-200">
            {schedule.type.replace("_", " ").toUpperCase()}
          </span>
          <span className="text-yellow-300">
            {schedule.day_of_week
              ? parseDays(schedule.day_of_week).join(", ")
              : "No days selected"}{" "}
            at {schedule.time}
          </span>
        </div>
        <div className="text-gray-300">{getScheduleDescription(schedule)}</div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={onEdit} disabled={disabled}>
            Edit
          </Button>
          <Button variant="secondary" onClick={onDuplicate} disabled={disabled}>
            Duplicate
          </Button>
          <Button variant="danger" onClick={onRemove} disabled={disabled}>
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
