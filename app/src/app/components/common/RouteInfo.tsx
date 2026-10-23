import React from "react";

type RouteInfoProps = {
  origin: string;
  destination: string;
  startsHere?: boolean;
};

export default function RouteInfo({
  origin,
  destination,
  startsHere,
}: RouteInfoProps) {
  return (
    <div
      className="mb-2 text-sm text-accent font-medium"
      role="region"
      aria-label={`Route from ${origin} to ${destination}`}
    >
      <span className="font-bold">{origin}</span>
      <span className="mx-2 text-accent-strong" aria-hidden="true">
        →
      </span>
      <span className="font-bold">{destination}</span>
      {startsHere && (
        <span
          tabIndex={0}
          aria-label="Starts here"
          className="group/sh relative ml-2 cursor-help rounded border border-accent-border/40 px-1 align-middle text-[10px] font-normal text-muted"
        >
          SH
          <span
            role="tooltip"
            className="pointer-events-none invisible absolute top-full right-0 z-10 mt-1 whitespace-nowrap rounded border border-accent-border/40 bg-surface-0 px-2 py-1 text-xs text-fg-soft group-hover/sh:visible group-focus/sh:visible"
          >
            Starts here
          </span>
        </span>
      )}
    </div>
  );
}
