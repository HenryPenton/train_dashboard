"use client";

import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import SectionCard from "../components/common/SectionCard";
import SectionHeading from "../components/common/SectionHeading";
import Button from "../components/common/Button";
import InputField from "../components/common/InputField";
import ErrorDisplay from "../components/common/ErrorDisplay";
import Loading from "../components/common/Loading";
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

const daysOfWeek = [
  "Monday",
  "Tuesday", 
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

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
    day_of_week: "Monday",
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

  useEffect(() => {
    fetchSchedules()
      .then(setSchedules)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewSchedule({ ...newSchedule, [e.target.name]: e.target.value });
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    
    let schedule: Schedule;
    
    if (newSchedule.type === "rail_departure") {
      if (!newSchedule.from_station_name || !newSchedule.from_station_code || 
          !newSchedule.to_station_name || !newSchedule.to_station_code || !newSchedule.time) {
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
      if (!newSchedule.time) return;
      schedule = {
        type: "tube_line_status",
        day_of_week: newSchedule.day_of_week,
        time: newSchedule.time,
      };
    } else {
      if (!newSchedule.from_name || !newSchedule.from_code || 
          !newSchedule.to_name || !newSchedule.to_code || !newSchedule.time) {
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

    // Reset form
    setNewSchedule({
      type: "rail_departure",
      day_of_week: "Monday",
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

  if (loading) return <PageLayout title="SCHEDULES"><Loading message="Loading schedules..." /></PageLayout>;
  if (error) return <PageLayout title="SCHEDULES"><ErrorDisplay message={error} /></PageLayout>;

  return (
    <PageLayout title="SCHEDULES" showNavigation={true}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Add New Schedule */}
        <SectionCard>
          <SectionHeading>📅 Add New Schedule</SectionHeading>
          <form onSubmit={handleAddSchedule} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-cyan-300 font-semibold">Schedule Type</label>
                <select
                  name="type"
                  value={newSchedule.type}
                  onChange={handleInputChange}
                  className="bg-[#2a2d35] border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="rail_departure">🚂 Rail Departure</option>
                  <option value="tube_line_status">🚇 Tube Line Status</option>
                  <option value="best_route">⭐ Best Route</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-cyan-300 font-semibold">Day of Week</label>
                <select
                  name="day_of_week"
                  value={newSchedule.day_of_week}
                  onChange={handleInputChange}
                  className="bg-[#2a2d35] border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <InputField
                label="Time"
                name="time"
                value={newSchedule.time}
                onChange={handleInputChange}
                placeholder="HH:MM"
                required
              />
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
                <div key={index} className="flex items-center justify-between p-4 bg-[#2a2d35] rounded border-l-4 border-cyan-500">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">
                        {schedule.type === "rail_departure" ? "🚂" : 
                         schedule.type === "tube_line_status" ? "🚇" : "⭐"}
                      </span>
                      <span className="font-semibold text-cyan-200">
                        {schedule.type.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="text-yellow-300">
                        {schedule.day_of_week} at {schedule.time}
                      </span>
                    </div>
                    <div className="text-gray-300">
                      {schedule.type === "rail_departure" && (
                        <>From {schedule.from_station_name} to {schedule.to_station_name}</>
                      )}
                      {schedule.type === "best_route" && (
                        <>From {schedule.from_name} to {schedule.to_name}</>
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
    </PageLayout>
  );
}