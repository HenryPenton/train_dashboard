import React from "react";

interface TubeRoutesListProps {
  routes: Array<{
    origin: string;
    originNaPTANOrATCO: string;
    destination: string;
    destinationNaPTANOrATCO: string;
  }>;
  onRemove: (idx: number) => void;
}

export default function TubeRoutesList({
  routes,
  onRemove,
}: TubeRoutesListProps) {
  return (
    <div className="mb-10">
      <h4 className="font-semibold mb-2">Tube Routes</h4>
      <ul>
        {routes.map((r, i) => (
          <li key={i} className="mb-1 flex items-center justify-between">
            <span>
              {r.origin} ({r.originNaPTANOrATCO}) → {r.destination} (
              {r.destinationNaPTANOrATCO})
            </span>
            <button
              type="button"
              aria-label="Remove route"
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
