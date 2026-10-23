import React from "react";
import { DepartureStatus } from "../sections/TrainDepartures";

type DepartureTimeProps = {
  status: DepartureStatus;
  scheduledTime: string;
  estimatedTime?: string;
  actualTime?: string;
};

export default function DepartureTime({
  status,
  scheduledTime,
  estimatedTime,
  actualTime,
}: DepartureTimeProps) {
  return (
    <div
      className="text-lg font-bold text-accent-soft"
      role="time"
      aria-label={`Departure time: ${status === "Cancelled" ? "Cancelled" : actualTime || scheduledTime}`}
    >
      <span className="text-muted font-normal">Departs: </span>
      {status === "Cancelled" ? (
        <span className="text-red-400 line-through">CANCELLED</span>
      ) : (
        <>
          {actualTime || scheduledTime}
          {estimatedTime !== scheduledTime && !actualTime && (
            <span className="ml-2 text-accent-2">({estimatedTime})</span>
          )}
        </>
      )}
    </div>
  );
}
