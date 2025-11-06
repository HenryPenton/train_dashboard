import React from "react";
import Button from "../generic/Button";

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
type Schedule = RailDepartureSchedule | TubeLineStatusSchedule | BestRouteSchedule;
type Schedules = { schedules: Schedule[] };

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

interface ScheduleFormProps {
  schedules: Schedules;
  saving: boolean;
  validationError: string | null;
  handleAdd: (type: "rail_departure" | "tube_line_status" | "best_route") => void;
  handleChange: (idx: number, field: string, value: string) => void;
  handleDayCheckbox: (idx: number, checked: boolean, day: string) => void;
  handleDelete: (idx: number) => void;
  handleSave: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedules,
  saving,
  validationError,
  handleAdd,
  handleChange,
  handleDayCheckbox,
  handleDelete,
  handleSave,
}) => (
  <>
    <div className="mb-4 flex gap-3">
      <Button
        type="button"
        variant="primary"
        className="px-4 py-2"
        onClick={() => handleAdd("rail_departure")}
        icon={<span className="mr-2">🚆</span>}
      >
        Add National Rail Departure
      </Button>
      <Button
        type="button"
        variant="success"
        className="px-4 py-2"
        onClick={() => handleAdd("tube_line_status")}
        icon={<span className="mr-2">🚇</span>}
      >
        Add Tube Line Status
      </Button>
      <Button
        type="button"
        variant="info"
        className="px-4 py-2"
        onClick={() => handleAdd("best_route")}
        icon={<span className="mr-2">⭐</span>}
      >
        Add Best TfL Route
      </Button>
    </div>
    <form
      onSubmit={e => {
        e.preventDefault();
        handleSave();
      }}
    >
      {validationError && (
        <div className="mb-2 text-red-600 font-semibold">{validationError}</div>
      )}
      {schedules.schedules.length === 0 && <div>No schedules configured.</div>}
      {schedules.schedules.map((sched, idx) => (
        <div key={idx} className="border rounded p-3 mb-3 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold capitalize">
              {sched.type.replaceAll("_", " ")}
            </span>
            <Button
              type="button"
              variant="danger"
              className="text-red-500 px-2 py-1"
              onClick={() => handleDelete(idx)}
            >
              Delete
            </Button>
          </div>
          {sched.type === "rail_departure" && (
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="From Station CRS"
                  value={sched.from_station_code}
                  required
                  onChange={e => handleChange(idx, "from_station_code", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="To Station CRS"
                  value={sched.to_station_code}
                  required
                  onChange={e => handleChange(idx, "to_station_code", e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="From Station Name"
                  value={sched.from_station_name}
                  required
                  onChange={e => handleChange(idx, "from_station_name", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="To Station Name"
                  value={sched.to_station_name}
                  required
                  onChange={e => handleChange(idx, "to_station_name", e.target.value)}
                />
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                {weekdays.map(d => (
                  <label key={d.value} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={parseDays(sched.day_of_week).includes(d.value)}
                      onChange={e => handleDayCheckbox(idx, e.target.checked, d.value)}
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
                  onChange={e => handleChange(idx, "time", e.target.value)}
                />
              </div>
            </div>
          )}
          {sched.type === "tube_line_status" && (
            <div className="flex gap-2 items-center flex-wrap mb-2">
              {weekdays.map(d => (
                <label key={d.value} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={parseDays(sched.day_of_week).includes(d.value)}
                    onChange={e => handleDayCheckbox(idx, e.target.checked, d.value)}
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
                onChange={e => handleChange(idx, "time", e.target.value)}
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
                  onChange={e => handleChange(idx, "from_code", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="To NaPTAN ID"
                  value={sched.to_code}
                  required
                  onChange={e => handleChange(idx, "to_code", e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="From Name"
                  value={sched.from_name}
                  required
                  onChange={e => handleChange(idx, "from_name", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="To Name"
                  value={sched.to_name}
                  required
                  onChange={e => handleChange(idx, "to_name", e.target.value)}
                />
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                {weekdays.map(d => (
                  <label key={d.value} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={parseDays(sched.day_of_week).includes(d.value)}
                      onChange={e => handleDayCheckbox(idx, e.target.checked, d.value)}
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
                  onChange={e => handleChange(idx, "time", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <Button
        type="submit"
        variant="info"
        className="mt-2 w-full justify-center"
        loading={saving}
        icon={<span className="mr-2">💾</span>}
      >
        Save Schedules
      </Button>
    </form>
  </>
);

export default ScheduleForm;
