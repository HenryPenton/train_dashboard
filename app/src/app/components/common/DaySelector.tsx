import React from "react";

interface DaySelectorProps {
  selectedDays: string;
  onChange: (days: string) => void;
  className?: string;
  label?: string;
}

const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

// Utility functions for handling multiple days
function parseDays(days: string): string[] {
  return days ? days.split(",") : [];
}

function joinDays(days: string[]): string {
  return days.join(",");
}

export default function DaySelector({
  selectedDays,
  onChange,
  className = "",
  label = "Days of Week (select one or more)",
}: DaySelectorProps) {
  const handleDayCheckbox = (checked: boolean, day: string) => {
    const currentDays = parseDays(selectedDays);
    let newDays;
    if (checked) {
      newDays = [...currentDays, day].filter((v, i, a) => a.indexOf(v) === i);
    } else {
      newDays = currentDays.filter((d) => d !== day);
    }
    onChange(joinDays(newDays));
  };

  return (
    <div
      className={`flex flex-col gap-3 ${className}`}
      role="group"
      aria-labelledby="day-selector-label"
    >
      {label && (
        <label id="day-selector-label" className="text-cyan-300 font-semibold">
          {label}
        </label>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {daysOfWeek.map((day) => {
          const isSelected = parseDays(selectedDays).includes(day);
          const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1);
          return (
            <label
              key={day}
              className={`cursor-pointer flex items-center justify-center px-3 py-2 rounded border transition-colors ${
                isSelected
                  ? "bg-cyan-600 border-cyan-400 text-white"
                  : "bg-[#2a2d35] border-gray-600 text-gray-300 hover:bg-[#3a3d45] hover:border-cyan-500"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isSelected}
                onChange={(e) => handleDayCheckbox(e.target.checked, day)}
                aria-label={`${dayCapitalized} - ${isSelected ? "selected" : "not selected"}`}
              />
              <span className="text-sm font-medium" aria-hidden="true">
                {day}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// Export utility functions for use by other components
export { parseDays, joinDays };
