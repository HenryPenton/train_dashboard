import React from "react";
import { DepartureStatus } from "../sections/TrainDepartures";
import { DEFAULT_TIME_DISPLAY, type TimeDisplay } from "../../stores/config";

type DepartureTimeProps = {
  status: DepartureStatus;
  time: string;
  timeDisplay?: TimeDisplay;
};

export default function DepartureTime({
  status,
  time,
  timeDisplay = DEFAULT_TIME_DISPLAY,
}: DepartureTimeProps) {
  const arrival = timeDisplay === "arrival";
  return (
    <div
      className="text-lg font-bold text-accent-soft"
      role="time"
      aria-label={`${arrival ? "Arrival" : "Departure"} time: ${status === "Cancelled" ? "Cancelled" : time}`}
    >
      <span className="text-muted font-normal">
        {arrival ? "Arrives: " : "Departs: "}
      </span>
      {status === "Cancelled" ? (
        <span className="text-red-400 line-through">CANCELLED</span>
      ) : (
        time
      )}
    </div>
  );
}
