import React from "react";
import SectionCard from "../common/SectionCard";
import SectionHeading from "../common/SectionHeading";
import ScheduleItem, { Schedule } from "./ScheduleItem";

export interface SchedulesData {
  schedules: Schedule[];
}

interface SchedulesListProps {
  schedules: SchedulesData;
  editingScheduleIndex: number | null;
  editingSchedule: Schedule | null;
  validationError: string | null;
  onEditSchedule: (index: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemoveSchedule: (index: number) => void;
  onTimeChange: (time: string) => void;
  onDaysChange: (days: string) => void;
  disabled?: boolean;
}

export default function SchedulesList({
  schedules,
  editingScheduleIndex,
  editingSchedule,
  validationError,
  onEditSchedule,
  onSaveEdit,
  onCancelEdit,
  onRemoveSchedule,
  onTimeChange,
  onDaysChange,
  disabled = false,
}: SchedulesListProps) {
  return (
    <SectionCard>
      <SectionHeading>📋 Current Schedules</SectionHeading>
      {validationError && editingScheduleIndex !== null && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded text-red-200">
          <span className="font-semibold">Validation Error: </span>
          {validationError}
        </div>
      )}
      {schedules.schedules.length === 0 ? (
        <div className="text-gray-400">No schedules configured.</div>
      ) : (
        <div className="space-y-3">
          {schedules.schedules.map((schedule, index) => (
            <ScheduleItem
              key={index}
              schedule={schedule}
              isEditing={editingScheduleIndex === index}
              editingSchedule={editingSchedule || undefined}
              onEdit={() => onEditSchedule(index)}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onRemove={() => onRemoveSchedule(index)}
              onTimeChange={onTimeChange}
              onDaysChange={onDaysChange}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </SectionCard>
  );
}