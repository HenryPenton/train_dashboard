import React from "react";

type RouteInfoProps = {
  origin: string;
  destination: string;
};

export default function RouteInfo({ origin, destination }: RouteInfoProps) {
  return (
    <div
      className="mb-2 text-sm text-cyan-300 font-medium"
      role="region"
      aria-label={`Route from ${origin} to ${destination}`}
    >
      <span className="font-bold">{origin}</span>
      <span className="mx-2 text-cyan-400" aria-hidden="true">
        →
      </span>
      <span className="font-bold">{destination}</span>
    </div>
  );
}
