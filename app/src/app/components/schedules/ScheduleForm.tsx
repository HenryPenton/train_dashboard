import React from "react";
import Button from "../common/Button";
import InputField from "../common/InputField";
import SectionCard from "../common/SectionCard";
import SectionHeading from "../common/SectionHeading";
import DaySelector from "../common/DaySelector";
import { Schedule } from "./ScheduleItem";

interface NewScheduleForm {
  type: Schedule["type"];
  day_of_week: string;
  time: string;
  from_station_name: string;
  from_station_code: string;
  to_station_name: string;
  to_station_code: string;
  from_name: string;
  from_code: string;
  to_name: string;
  to_code: string;
}

interface ScheduleFormProps {
  newSchedule: NewScheduleForm;
  validationError: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDaysChange: (days: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ScheduleForm({
  newSchedule,
  validationError,
  onChange,
  onDaysChange,
  onSubmit,
}: ScheduleFormProps) {
  return (
    <SectionCard>
      <SectionHeading>📅 Add New Schedule</SectionHeading>
      {validationError && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded text-red-200">
          <span className="font-semibold">Validation Error: </span>
          {validationError}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-cyan-300 font-semibold">Schedule Type</label>
            <select
              name="type"
              value={newSchedule.type}
              onChange={onChange}
              className="bg-[#2a2d35] border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="rail_departure">🚂 Rail Departure</option>
              <option value="tube_line_status">🚇 Tube Line Status</option>
              <option value="best_route">⭐ Best Route</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-cyan-300 font-semibold">
              Time (24-hour format)
              <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="time"
              name="time"
              value={newSchedule.time}
              onChange={onChange}
              required
              className="bg-[#2a2d35] border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Days of Week Selection */}
        <DaySelector
          selectedDays={newSchedule.day_of_week}
          onChange={onDaysChange}
        />

        {/* Conditional fields based on schedule type */}
        {newSchedule.type === "rail_departure" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="From Station Name"
              name="from_station_name"
              value={newSchedule.from_station_name}
              onChange={onChange}
              placeholder="e.g., London Paddington"
              required
            />
            <InputField
              label="From Station Code"
              name="from_station_code"
              value={newSchedule.from_station_code}
              onChange={onChange}
              placeholder="e.g., PAD"
              required
            />
            <InputField
              label="To Station Name"
              name="to_station_name"
              value={newSchedule.to_station_name}
              onChange={onChange}
              placeholder="e.g., Reading"
              required
            />
            <InputField
              label="To Station Code"
              name="to_station_code"
              value={newSchedule.to_station_code}
              onChange={onChange}
              placeholder="e.g., RDG"
              required
            />
          </div>
        )}

        {newSchedule.type === "best_route" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="From Place Name"
              name="from_name"
              value={newSchedule.from_name}
              onChange={onChange}
              placeholder="e.g., King's Cross"
              required
            />
            <InputField
              label="From Code"
              name="from_code"
              value={newSchedule.from_code}
              onChange={onChange}
              placeholder="e.g., 490G00000570"
              required
            />
            <InputField
              label="To Place Name"
              name="to_name"
              value={newSchedule.to_name}
              onChange={onChange}
              placeholder="e.g., London Bridge"
              required
            />
            <InputField
              label="To Code"
              name="to_code"
              value={newSchedule.to_code}
              onChange={onChange}
              placeholder="e.g., 490G00000558"
              required
            />
          </div>
        )}

        <Button type="submit" variant="success">
          Add Schedule
        </Button>
      </form>
    </SectionCard>
  );
}

export type { NewScheduleForm };