import React from "react";

type TflLineStatusType = {
  name: string;
  status: string;
  statusSeverity: number;
};

function getStatusClass(statusSeverity: number): string {
  // Severity: 1 (worst) to 10 (best)
  // Example color map: 1-3 red, 4-5 orange, 6-7 yellow, 8-9 light green, 10 green
  const severityColors: { [key: number]: string } = {
    1: "text-[#7f1d1d] font-semibold", // darkest red
    2: "text-[#b91c1c] font-semibold", // dark red
    3: "text-[#dc2626] font-semibold", // medium red
    4: "text-[#ef4444] font-semibold", // red
    5: "text-[#f87171] font-semibold", // light red
    6: "text-[#fdba74] font-semibold", // light orange
    7: "text-[#f59e42] font-semibold", // orange
    8: "text-[#fbbf24] font-semibold", // yellow-orange
    9: "text-[#fde047] font-semibold", // yellow
    10: "text-[#22c55e] font-semibold", // dark green
  };
  return severityColors[statusSeverity] || "text-[#f1f1f1]";
}

export default function TflLineStatusList({
  tflStatuses,
}: {
  tflStatuses: TflLineStatusType[];
}) {
  return (
    <ul role="list">
      {tflStatuses.map((line, i) => (
        <li
          key={i}
          className="mb-3 text-[1.08rem]"
          style={{ letterSpacing: "0.01em" }}
          role="listitem"
          aria-label={`Line ${line.name}`}
        >
          <strong aria-label={`Line name ${line.name}`}>{line.name}</strong>:{" "}
          <span
            className={getStatusClass(line.statusSeverity)}
            aria-label={`Line status ${line.status || "Unknown"}`}
          >
            {line.status || "Unknown"}
          </span>
        </li>
      ))}
    </ul>
  );
}
