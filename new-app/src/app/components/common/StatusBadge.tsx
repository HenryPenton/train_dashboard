import React from "react";

type StatusBadgeProps = {
  status: string;
  severity: number;
};

export default function StatusBadge({ status, severity }: StatusBadgeProps) {
  const getStatusColor = (severity: number): string => {
    // Severity: 1 (worst) to 10 (best) - matching old app's detailed color mapping
    const severityColors: { [key: number]: string } = {
      1: "text-red-900 font-semibold", // darkest red
      2: "text-red-800 font-semibold", // dark red
      3: "text-red-700 font-semibold", // medium red
      4: "text-red-500 font-semibold", // red
      5: "text-red-400 font-semibold", // light red
      6: "text-orange-400 font-semibold", // light orange
      7: "text-orange-500 font-semibold", // orange
      8: "text-yellow-400 font-semibold", // yellow-orange
      9: "text-yellow-300 font-semibold", // yellow
      10: "text-green-400 font-semibold", // dark green
    };
    return severityColors[severity] || "text-gray-300";
  };

  const getBorderColor = (severity: number): string => {
    const borderColors: { [key: number]: string } = {
      1: "border-red-900",
      2: "border-red-800",
      3: "border-red-700",
      4: "border-red-500",
      5: "border-red-400",
      6: "border-orange-400",
      7: "border-orange-500",
      8: "border-yellow-400",
      9: "border-yellow-300",
      10: "border-green-400",
    };
    return borderColors[severity] || "border-gray-500";
  };

  return (
    <div className={`text-sm font-semibold px-3 py-1 rounded-full border ${getBorderColor(severity)}/50 ${getStatusColor(severity)}`}>
      {status || "Unknown"}
    </div>
  );
}
