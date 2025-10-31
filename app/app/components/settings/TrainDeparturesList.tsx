import React from "react";

interface TrainDeparturesListProps {
  departures: Array<{
    origin: string;
    originCode: string;
    destination: string;
    destinationCode: string;
  }>;
  onRemove: (idx: number) => void;
}

export default function TrainDeparturesList({
  departures,
  onRemove,
}: TrainDeparturesListProps) {
  return (
    <div className="mb-8">
      <h4 className="font-semibold mb-2">Train Departures</h4>
      <ul>
        {departures.map((d, i) => (
          <li key={i} className="mb-1 flex items-center justify-between">
            <span>
              {d.origin} ({d.originCode}) → {d.destination} ({d.destinationCode}
              )
            </span>
            <button
              type="button"
              aria-label="Remove departure"
              className="ml-2 text-red-500 hover:text-red-700 font-bold"
              onClick={() => onRemove(i)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
