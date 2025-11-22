"use client";

import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import SectionCard from "../components/common/SectionCard";
import SectionHeading from "../components/common/SectionHeading";
import Button from "../components/common/Button";
import InputField from "../components/common/InputField";
import ErrorDisplay from "../components/common/ErrorDisplay";
import Loading from "../components/common/Loading";
import TflStopSidebar, { SidebarItem } from "../components/tfl/TflStopSidebar";
import PlaceDetails from "../components/tfl/PlaceDetails";
import { APP_CONSTANTS } from "../constants/app";

type ScheduleBase = {
  day_of_week: string;
  time: string;
};

type RailDepartureSchedule = ScheduleBase & {
  type: "rail_departure";
  from_station_code: string;
  to_station_code: string;
  from_station_name: string;
  to_station_name: string;
};

type TubeLineStatusSchedule = ScheduleBase & {
  type: "tube_line_status";
};

type BestRouteSchedule = ScheduleBase & {
  type: "best_route";
  from_code: string;
  to_code: string;
  from_name: string;
  to_name: string;
};

type Schedule =
  | RailDepartureSchedule
  | TubeLineStatusSchedule
  | BestRouteSchedule;

type SchedulesData = {
  schedules: Schedule[];
};

const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

// Utility functions for handling multiple days
function parseDays(days: string): string[] {
  return days ? days.split(",") : [];
}

function joinDays(days: string[]): string {
  return days.join(",");
}

async function fetchSchedules(): Promise<SchedulesData> {
  try {
    const res = await fetch(APP_CONSTANTS.API_ENDPOINTS.SCHEDULES);
    if (!res.ok) throw new Error("Failed to fetch schedules");
    return await res.json();
  } catch (e) {
    console.log("Error fetching schedules:", e);
    throw e;
  }
}

async function saveSchedules(schedules: SchedulesData): Promise<void> {
  try {
    const res = await fetch(APP_CONSTANTS.API_ENDPOINTS.SCHEDULES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schedules),
    });
    if (!res.ok) throw new Error("Failed to save schedules");
  } catch (e) {
    console.log("Error saving schedules:", e);
    throw e;
  }
}

export default function Schedules() {
  const [schedules, setSchedules] = useState<SchedulesData>({ schedules: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [newSchedule, setNewSchedule] = useState({
    type: "rail_departure" as Schedule["type"],
    day_of_week: "",
    time: "",
    from_station_name: "",
    from_station_code: "",
    to_station_name: "",
    to_station_code: "",
    from_name: "",
    from_code: "",
    to_name: "",
    to_code: "",
  });

  // Sidebar state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSidebarItem, setSelectedSidebarItem] =
    useState<SidebarItem | null>(null);

  useEffect(() => {
    fetchSchedules()
      .then(setSchedules)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setNewSchedule({ ...newSchedule, [e.target.name]: e.target.value });
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate at least one day is selected
    if (!newSchedule.day_of_week) {
      setError("Please select at least one day of the week");
      return;
    }

    let schedule: Schedule;

    if (newSchedule.type === "rail_departure") {
      if (
        !newSchedule.from_station_name ||
        !newSchedule.from_station_code ||
        !newSchedule.to_station_name ||
        !newSchedule.to_station_code ||
        !newSchedule.time
      ) {
        setError("Please fill in all required fields");
        return;
      }
      schedule = {
        type: "rail_departure",
        day_of_week: newSchedule.day_of_week,
        time: newSchedule.time,
        from_station_name: newSchedule.from_station_name,
        from_station_code: newSchedule.from_station_code,
        to_station_name: newSchedule.to_station_name,
        to_station_code: newSchedule.to_station_code,
      };
    } else if (newSchedule.type === "tube_line_status") {
      if (!newSchedule.time) {
        setError("Please enter a time");
        return;
      }
      schedule = {
        type: "tube_line_status",
        day_of_week: newSchedule.day_of_week,
        time: newSchedule.time,
      };
    } else {
      if (
        !newSchedule.from_name ||
        !newSchedule.from_code ||
        !newSchedule.to_name ||
        !newSchedule.to_code ||
        !newSchedule.time
      ) {
        setError("Please fill in all required fields");
        return;
      }
      schedule = {
        type: "best_route",
        day_of_week: newSchedule.day_of_week,
        time: newSchedule.time,
        from_name: newSchedule.from_name,
        from_code: newSchedule.from_code,
        to_name: newSchedule.to_name,
        to_code: newSchedule.to_code,
      };
    }

    setSchedules({
      schedules: [...schedules.schedules, schedule],
    });

    // Clear any previous error messages
    setError(null);

    // Reset form
    setNewSchedule({
      type: "rail_departure",
      day_of_week: "",
      time: "",
      from_station_name: "",
      from_station_code: "",
      to_station_name: "",
      to_station_code: "",
      from_name: "",
      from_code: "",
      to_name: "",
      to_code: "",
    });
  };

  const handleRemoveSchedule = (index: number) => {
    const updatedSchedules = [...schedules.schedules];
    updatedSchedules.splice(index, 1);
    setSchedules({ schedules: updatedSchedules });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSchedules(schedules);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save schedules");
    } finally {
      setSaving(false);
    }
  };

  const handleDayCheckbox = (checked: boolean, day: string) => {
    const currentDays = parseDays(newSchedule.day_of_week);
    let newDays;
    if (checked) {
      newDays = [...currentDays, day].filter((v, i, a) => a.indexOf(v) === i);
    } else {
      newDays = currentDays.filter((d) => d !== day);
    }
    setNewSchedule({ ...newSchedule, day_of_week: joinDays(newDays) });
  };

  if (loading)
    return (
      <PageLayout title="SCHEDULES">
        <Loading message="Loading schedules..." />
      </PageLayout>
    );
  if (error)
    return (
      <PageLayout title="SCHEDULES">
        <ErrorDisplay message={error} />
      </PageLayout>
    );

  return (
    <PageLayout title="SCHEDULES" showNavigation={true}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0">
            <TflStopSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedSidebarItem={selectedSidebarItem}
              setSelectedSidebarItem={setSelectedSidebarItem}
            />
            {selectedSidebarItem && (
              <div className="mt-4">
                <PlaceDetails
                  selectedSidebarItem={selectedSidebarItem}
                  showButtons={false}
                />
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-8">
            {/* Add New Schedule */}
            <SectionCard>
              <SectionHeading>📅 Add New Schedule</SectionHeading>
              <form onSubmit={handleAddSchedule} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-cyan-300 font-semibold">
                      Schedule Type
                    </label>
                    <select
                      name="type"
                      value={newSchedule.type}
                      onChange={handleInputChange}
                      className="bg-[#2a2d35] border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="rail_departure">🚂 Rail Departure</option>
                      <option value="tube_line_status">
                        🚇 Tube Line Status
                      </option>
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
                      onChange={handleInputChange}
                      required
                      className="bg-[#2a2d35] border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Days of Week Selection */}
                <div className="flex flex-col gap-3">
                  <label className="text-cyan-300 font-semibold">
                    Days of Week (select one or more)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {daysOfWeek.map((day) => {
                      const isSelected = parseDays(
                        newSchedule.day_of_week,
                      ).includes(day);
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
                            onChange={(e) =>
                              handleDayCheckbox(e.target.checked, day)
                            }
                          />
                          <span className="text-sm font-medium">{day}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional fields based on schedule type */}
                {newSchedule.type === "rail_departure" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="From Station Name"
                      name="from_station_name"
                      value={newSchedule.from_station_name}
                      onChange={handleInputChange}
                      placeholder="e.g., London Paddington"
                      required
                    />
                    <InputField
                      label="From Station Code"
                      name="from_station_code"
                      value={newSchedule.from_station_code}
                      onChange={handleInputChange}
                      placeholder="e.g., PAD"
                      required
                    />
                    <InputField
                      label="To Station Name"
                      name="to_station_name"
                      value={newSchedule.to_station_name}
                      onChange={handleInputChange}
                      placeholder="e.g., Reading"
                      required
                    />
                    <InputField
                      label="To Station Code"
                      name="to_station_code"
                      value={newSchedule.to_station_code}
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      placeholder="e.g., King's Cross"
                      required
                    />
                    <InputField
                      label="From Code"
                      name="from_code"
                      value={newSchedule.from_code}
                      onChange={handleInputChange}
                      placeholder="e.g., 490G00000570"
                      required
                    />
                    <InputField
                      label="To Place Name"
                      name="to_name"
                      value={newSchedule.to_name}
                      onChange={handleInputChange}
                      placeholder="e.g., London Bridge"
                      required
                    />
                    <InputField
                      label="To Code"
                      name="to_code"
                      value={newSchedule.to_code}
                      onChange={handleInputChange}
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

            {/* Current Schedules */}
            <SectionCard>
              <SectionHeading>📋 Current Schedules</SectionHeading>
              {schedules.schedules.length === 0 ? (
                <div className="text-gray-400">No schedules configured.</div>
              ) : (
                <div className="space-y-3">
                  {schedules.schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-[#2a2d35] rounded border-l-4 border-cyan-500"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">
                            {schedule.type === "rail_departure"
                              ? "🚂"
                              : schedule.type === "tube_line_status"
                                ? "🚇"
                                : "⭐"}
                          </span>
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
                        <div className="text-gray-300">
                          {schedule.type === "rail_departure" && (
                            <>
                              From {schedule.from_station_name} to{" "}
                              {schedule.to_station_name}
                            </>
                          )}
                          {schedule.type === "best_route" && (
                            <>
                              From {schedule.from_name} to {schedule.to_name}
                            </>
                          )}
                          {schedule.type === "tube_line_status" && (
                            <>TfL Line Status Overview</>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveSchedule(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Actions */}
            <SectionCard>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Schedules"}
                </Button>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
