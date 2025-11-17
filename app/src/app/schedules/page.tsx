"use client";

import { useEffect, useState } from "react";
import ScheduleForm from "../components/schedules/ScheduleForm";
import PlaceDetails from "../components/TfL/PlaceDetails";
import TflStopSidebar, { SidebarItem } from "../components/TfL/TflStopSidebar";
import { SchedulesSchema } from "../validators/frontend-validators/ScheduleSchema";

async function fetchSchedules() {
  try {
    const res = await fetch("/api/schedules");
    const schedules = await res.json();
    const validSchedules = SchedulesSchema.parse(schedules);
    return validSchedules;
  } catch (e) {
    console.log("Error fetching schedules:", e);
    throw e;
  }
}

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

type Schedules = {
  schedules: Schedule[];
};

function parseDays(days: string): string[] {
  return days ? days.split(",") : [];
}

function joinDays(days: string[]): string {
  return days.join(",");
}

function saveSchedules(schedules: Schedules) {
  const validatedSchedules = SchedulesSchema.parse(schedules);
  return fetch("/api/schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validatedSchedules),
  }).catch((e) => {
    console.log("Error saving schedules:", e);
  });
}

export default function SchedulesPage() {
  function handleDuplicate(idx: number) {
    setSchedules((prev) => {
      const updated = [...prev.schedules];
      const clone = { ...updated[idx] };
      updated.splice(idx + 1, 0, clone);
      return { schedules: updated };
    });
  }
  const [schedules, setSchedules] = useState<Schedules>({ schedules: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSidebarItem, setSelectedSidebarItem] =
    useState<SidebarItem | null>(null);

  useEffect(() => {
    fetchSchedules()
      .then((data) => {
        setSchedules(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load schedules");
        setLoading(false);
      });
  }, []);

  function handleAdd(
    type: "rail_departure" | "tube_line_status" | "best_route",
  ) {
    let newSchedule: Schedule;
    if (type === "rail_departure") {
      newSchedule = {
        type: "rail_departure",
        from_station_code: "",
        to_station_code: "",
        from_station_name: "",
        to_station_name: "",
        day_of_week: "",
        time: "08:00",
      };
    } else if (type === "tube_line_status") {
      newSchedule = {
        type: "tube_line_status",
        day_of_week: "",
        time: "08:00",
      };
    } else {
      newSchedule = {
        type: "best_route",
        from_code: "",
        to_code: "",
        from_name: "",
        to_name: "",
        day_of_week: "",
        time: "08:00",
      };
    }
    setSchedules((prev) => ({
      schedules: [...prev.schedules, newSchedule],
    }));
  }

  function handleChange(idx: number, field: string, value: string) {
    setSchedules((prev) => {
      const updated = [...prev.schedules];
      updated[idx] = { ...updated[idx], [field]: value };
      return { schedules: updated };
    });
  }

  function handleDayCheckbox(idx: number, checked: boolean, day: string) {
    setSchedules((prev) => {
      const updated = [...prev.schedules];
      const currentDays = parseDays(updated[idx].day_of_week);
      let newDays;
      if (checked) {
        newDays = [...currentDays, day].filter((v, i, a) => a.indexOf(v) === i);
      } else {
        newDays = currentDays.filter((d) => d !== day);
      }
      updated[idx] = { ...updated[idx], day_of_week: joinDays(newDays) };
      return { schedules: updated };
    });
  }

  function handleDelete(idx: number) {
    setSchedules((prev) => {
      const updated = [...prev.schedules];
      updated.splice(idx, 1);
      return { schedules: updated };
    });
  }
  const isScheduleComplete = (s: Schedule): boolean =>
    Object.values(s).every(Boolean);

  async function handleSave() {
    setValidationError(null);
    setSaving(true);
    setError(null);
    // Validate all schedules
    const incomplete = schedules.schedules.find((s) => !isScheduleComplete(s));
    if (incomplete) {
      setValidationError(
        "Please fill in all fields for every schedule before saving.",
      );
      setSaving(false);
      return;
    }
    try {
      await saveSchedules(schedules);
    } catch {
      setError("Failed to save schedules");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading schedules...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <main className="p-8 max-w-4xl mx-auto flex flex-col md:flex-row">
      <div className="w-full md:w-64 md:mr-8 md:mb-0 mb-8 p-0 border-0 md:border-r md:pr-4">
        <TflStopSidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSidebarItem={selectedSidebarItem}
          setSelectedSidebarItem={setSelectedSidebarItem}
        />
      </div>
      {/* Main content */}
      <section className="flex-1">
        {selectedSidebarItem !== null && (
          <PlaceDetails
            selectedSidebarItem={selectedSidebarItem}
            showButtons={false}
            isInTubeStations={false}
          />
        )}
        <h1 className="text-2xl font-bold mb-4">Schedules</h1>

        <ScheduleForm
          schedules={schedules}
          saving={saving}
          validationError={validationError}
          handleAdd={handleAdd}
          handleChange={handleChange}
          handleDayCheckbox={handleDayCheckbox}
          handleDelete={handleDelete}
          handleSave={handleSave}
          handleDuplicate={handleDuplicate}
        />
      </section>
    </main>
  );
}
