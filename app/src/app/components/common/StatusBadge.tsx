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
  return (
    <div
      className={`text-sm font-semibold px-3 py-1 rounded-full border ${getSeverityBorderColor(severity)}/50 ${getSeverityTextColor(severity)}`}
    >
      {status || "Unknown"}
    </div>
  );
}
