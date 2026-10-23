import React from "react";

type ArrivalType = {
  id: string;
  lineId: string;
  lineName: string;
  platformName: string;
  timeToStation: number;
  expectedArrival: string;
  towards: string;
  currentLocation?: string;
  destinationName?: string;
  direction?: string;
};

type TflArrivalCardProps = {
  arrival: ArrivalType;
  formatTimeToStation: (seconds: number) => string;
};

export default function TflArrivalCard({
  arrival,
  formatTimeToStation,
}: TflArrivalCardProps) {
  return (
    <div
      className="flex justify-between items-center p-3 bg-gradient-to-r from-surface-3 to-surface-2 rounded-lg border border-yellow-500/30 shadow-md"
      role="listitem"
      aria-label={`Train to ${arrival.towards}, arriving in ${formatTimeToStation(arrival.timeToStation)}`}
    >
      <div className="flex flex-col mr-4">
        <div
          className="text-base font-medium text-fg-strong"
          aria-label="Destination"
        >
          to {arrival.towards}
        </div>
        {arrival.currentLocation && (
          <div className="text-xs text-muted" aria-label="Current location">
            {arrival.currentLocation}
          </div>
        )}
      </div>
      <div
        className="text-lg font-bold text-accent text-right px-3 py-1 whitespace-nowrap"
        aria-label="Arrival time"
        role="status"
        aria-live="polite"
      >
        {formatTimeToStation(arrival.timeToStation)}
      </div>
    </div>
  );
}
