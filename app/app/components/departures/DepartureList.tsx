import React from "react";
import DepartureListItem from "./DepartureListItem";

type Departure = {
  origin: string;
  destination: string;
  actual: string;
  platform: string;
  delay: number;
  status: "Early" | "On time" | "Late";
};

export default function DepartureList({
  departures,
}: {
  departures: Departure[];
}) {
  if (departures.length === 0) {
    return (
      <div role="status" aria-label="No departures found">
        No departures found for this destination.
      </div>
    );
  }
  return (
    <ul role="list" aria-label="Departure list">
      {departures.map((dep, i) => (
        <DepartureListItem key={i} dep={dep} />
      ))}
    </ul>
  );
}
