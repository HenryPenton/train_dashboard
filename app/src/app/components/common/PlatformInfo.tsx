import React from "react";
import { DEFAULT_TIME_DISPLAY, type TimeDisplay } from "../../stores/config";

type PlatformInfoProps = {
  platform: string;
  timeDisplay?: TimeDisplay;
};

export default function PlatformInfo({
  platform,
  timeDisplay = DEFAULT_TIME_DISPLAY,
}: PlatformInfoProps) {
  return (
    <div
      className="text-sm"
      aria-label={`${timeDisplay === "arrival" ? "Arriving at" : "Departing from"} platform ${platform}`}
    >
      <span className="text-muted">Platform: </span>
      <span className="text-fg-soft font-semibold">{platform}</span>
    </div>
  );
}
