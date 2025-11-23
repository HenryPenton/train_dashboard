import React from "react";
import {
  getSeverityTextColor,
  getSeverityBorderColor,
} from "../../utils/colorMappings";

type StatusBadgeProps = {
  status: string;
  severity: number;
};

export default function StatusBadge({ status, severity }: StatusBadgeProps) {
  const statusText = status || "Unknown";

  return (
    <div
      className={`text-sm font-semibold px-3 py-1 rounded-full border ${getSeverityBorderColor(severity)}/50 ${getSeverityTextColor(severity)}`}
      role="status"
      aria-label={`Service status: ${statusText}, severity level ${severity}`}
    >
      {statusText}
    </div>
  );
}
