"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/lists/Sidebar";
import { SchedulesSchema } from "../validators/frontend-validators/ScheduleSchema";
type SidebarItem = {
  CommonName: string;
  naptanID: string;
};


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

type RailDepartureSchedule = {
  type: "rail_departure";
  from_station_code: string;
  to_station_code: string;
  from_station_name: string;
  to_station_name: string;
  day_of_week: string;
  time: string;
};

type TubeLineStatusSchedule = {
  type: "tube_line_status";
  day_of_week: string;
  time: string;
};

type BestRouteSchedule = {
  type: "best_route";
  from_code: string;
  to_code: string;
  from_name: string;
  to_name: string;
  day_of_week: string;
  time: string;
};

type Schedule =
  | RailDepartureSchedule
  | TubeLineStatusSchedule
  | BestRouteSchedule;

type Schedules = {
  schedules: Schedule[];
};

// Helper for day_of_week checkboxes
const weekdays: { label: string; value: string }[] = [
  { label: "Monday", value: "mon" },
  { label: "Tuesday", value: "tue" },
  { label: "Wednesday", value: "wed" },
  { label: "Thursday", value: "thu" },
  { label: "Friday", value: "fri" },
  { label: "Saturday", value: "sat" },
  { label: "Sunday", value: "sun" },
];

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
  const [schedules, setSchedules] = useState<Schedules>({ schedules: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  // Sidebar state
  const [sidebarItems, setSidebarItems] = useState<Array<SidebarItem>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSidebarItem, setSelectedSidebarItem] =
    useState<SidebarItem | null>(null);

  useEffect(() => {
    fetchSchedules()
      .then((data) => {
        setSchedules(data);
        setLoading(false);
      })
      .catch((e) => {
        setError("Failed to load schedules");
        setLoading(false);
      });

    async function fetchSidebarItems() {
      try {
        const res = await fetch("/api/naptan");
        if (res.ok) {
          const data = await res.json();
          setSidebarItems(data);
        }
      } catch {
        // ignore errors for now
      }
    }
    fetchSidebarItems();
  }, []);

  const filteredSidebarItems = useMemo(
    () =>
      sidebarItems.filter((item) =>
        item.CommonName.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [sidebarItems, searchTerm],
  );

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

  function isScheduleComplete(s: Schedule): boolean {
    if (s.type === "rail_departure") {
      return (
        !!s.from_station_code &&
        !!s.to_station_code &&
        !!s.from_station_name &&
        !!s.to_station_name &&
        !!s.day_of_week &&
        !!s.time
      );
    } else if (s.type === "tube_line_status") {
      return !!s.day_of_week && !!s.time;
    } else if (s.type === "best_route") {
      return (
        !!s.from_code &&
        !!s.to_code &&
        !!s.from_name &&
        !!s.to_name &&
        !!s.day_of_week &&
        !!s.time
      );
    }
    return false;
  }

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
    } catch (e) {
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
        <Sidebar
          items={filteredSidebarItems}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedId={selectedSidebarItem?.naptanID ?? null}
          setSelectedId={(id) => {
            const found =
              sidebarItems.find((item) => item.naptanID === id) || null;
            setSelectedSidebarItem(found);
          }}
        />
      </div>
      {/* Main content */}
      <section className="flex-1">
        {selectedSidebarItem !== null && (
          <div className="mb-8 p-4 border rounded bg-gray-50">
            <h4 className="font-semibold mb-2">Place Details</h4>
            <div className="text-lg">
              <span className="font-medium">Name:</span>{" "}
              {selectedSidebarItem.CommonName}
            </div>
            <div className="text-lg">
              <span className="font-medium">NaPTAN ID:</span>{" "}
              {selectedSidebarItem.naptanID}
            </div>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-4">Schedules</h1>
        <div className="mb-4 flex gap-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
            onClick={() => handleAdd("rail_departure")}
          >
            <span className="mr-2">🚆</span> Add National Rail Departure
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 rounded-md bg-green-600 text-white font-semibold shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition"
            onClick={() => handleAdd("tube_line_status")}
          >
            <span className="mr-2">🚇</span> Add Tube Line Status
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 rounded-md bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition"
            onClick={() => handleAdd("best_route")}
          >
            <span className="mr-2">⭐</span> Add Best TfL Route
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {validationError && (
            <div className="mb-2 text-red-600 font-semibold">
              {validationError}
            </div>
          )}
          {schedules.schedules.length === 0 && (
            <div>No schedules configured.</div>
          )}
          {schedules.schedules.map((sched, idx) => (
            <div key={idx} className="border rounded p-3 mb-3 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold capitalize">
                  {sched.type.replaceAll("_", " ")}
                </span>
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => handleDelete(idx)}
                >
                  Delete
                </button>
              </div>
              {sched.type === "rail_departure" && (
                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex gap-2">
                    <input
                      className="input"
                      placeholder="From Station CRS"
                      value={sched.from_station_code}
                      required
                      onChange={(e) =>
                        handleChange(idx, "from_station_code", e.target.value)
                      }
                    />
                    <input
                      className="input"
                      placeholder="To Station CRS"
                      value={sched.to_station_code}
                      required
                      onChange={(e) =>
                        handleChange(idx, "to_station_code", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="input"
                      placeholder="From Station Name"
                      value={sched.from_station_name}
                      required
                      onChange={(e) =>
                        handleChange(idx, "from_station_name", e.target.value)
                      }
                    />
                    <input
                      className="input"
                      placeholder="To Station Name"
                      value={sched.to_station_name}
                      required
                      onChange={(e) =>
                        handleChange(idx, "to_station_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2 items-center flex-wrap">
                    {weekdays.map((d) => (
                      <label key={d.value} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={parseDays(sched.day_of_week).includes(
                            d.value,
                          )}
                          onChange={(e) =>
                            handleDayCheckbox(idx, e.target.checked, d.value)
                          }
                        />
                        <span>{d.label.slice(0, 3)}</span>
                      </label>
                    ))}
                    <span className="ml-2 text-xs text-gray-500">
                      ({sched.day_of_week})
                    </span>
                    <input
                      className="input ml-2"
                      type="time"
                      value={sched.time}
                      required
                      onChange={(e) =>
                        handleChange(idx, "time", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
              {sched.type === "tube_line_status" && (
                <div className="flex gap-2 items-center flex-wrap mb-2">
                  {weekdays.map((d) => (
                    <label key={d.value} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={parseDays(sched.day_of_week).includes(d.value)}
                        onChange={(e) =>
                          handleDayCheckbox(idx, e.target.checked, d.value)
                        }
                      />
                      <span>{d.label.slice(0, 3)}</span>
                    </label>
                  ))}
                  <span className="ml-2 text-xs text-gray-500">
                    ({sched.day_of_week})
                  </span>
                  <input
                    className="input ml-2"
                    type="time"
                    value={sched.time}
                    required
                    onChange={(e) => handleChange(idx, "time", e.target.value)}
                  />
                </div>
              )}
              {sched.type === "best_route" && (
                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex gap-2">
                    <input
                      className="input"
                      placeholder="From NaPTAN ID"
                      value={sched.from_code}
                      required
                      onChange={(e) =>
                        handleChange(idx, "from_code", e.target.value)
                      }
                    />
                    <input
                      className="input"
                      placeholder="To NaPTAN ID"
                      value={sched.to_code}
                      required
                      onChange={(e) =>
                        handleChange(idx, "to_code", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="input"
                      placeholder="From Name"
                      value={sched.from_name}
                      required
                      onChange={(e) =>
                        handleChange(idx, "from_name", e.target.value)
                      }
                    />
                    <input
                      className="input"
                      placeholder="To Name"
                      value={sched.to_name}
                      required
                      onChange={(e) =>
                        handleChange(idx, "to_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2 items-center flex-wrap">
                    {weekdays.map((d) => (
                      <label key={d.value} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={parseDays(sched.day_of_week).includes(
                            d.value,
                          )}
                          onChange={(e) =>
                            handleDayCheckbox(idx, e.target.checked, d.value)
                          }
                        />
                        <span>{d.label.slice(0, 3)}</span>
                      </label>
                    ))}
                    <span className="ml-2 text-xs text-gray-500">
                      ({sched.day_of_week})
                    </span>
                    <input
                      className="input ml-2"
                      type="time"
                      value={sched.time}
                      required
                      onChange={(e) =>
                        handleChange(idx, "time", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={saving}
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>💾 Save Schedules</>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
