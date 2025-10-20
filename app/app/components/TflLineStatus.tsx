import { useState, useEffect } from "react";

type TflLineStatusType = {
  name: string;
  status: string;
  statusSeverity: number;
};

export default function TflLineStatus() {
  const [tflStatuses, setTflStatuses] = useState<TflLineStatusType[] | null>(
    null
  );
  const [tflLoading, setTflLoading] = useState(false);
  const [tflError, setTflError] = useState("");

  useEffect(() => {
    const fetchTflStatuses = async () => {
      setTflLoading(true);
      setTflError("");
      try {
        const res = await fetch("/api/line-status");
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setTflStatuses(data);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        setTflError(message);
      } finally {
        setTflLoading(false);
      }
    };
    fetchTflStatuses();
  }, []);

  return (
    <section
      className="bg-[#23262f] rounded-[12px] p-6 text-[#f1f1f1] shadow-[0_2px_12px_0_rgba(0,0,0,0.25)]"
      aria-label="TFL Line Status Section"
      role="region"
    >
      <h2
        className="text-xl font-semibold text-white mb-2"
        role="heading"
        aria-level={2}
        aria-label="TFL Line Status Heading"
      >
        TFL Line Status
      </h2>
      {tflLoading && (
        <div role="status" aria-label="Loading TFL line statuses">
          Loading TFL line statuses...
        </div>
      )}
      {tflError && (
        <div
          className="text-[#ff4d4f] bg-[#2a1a1a] p-2 rounded mb-2"
          role="alert"
          aria-label="TFL line status error"
        >
          {tflError}
        </div>
      )}
      {tflStatuses && renderTflLineStatusList(tflStatuses)}
    </section>
  );
}

function getStatusClass(statusSeverity: number): string {
  // Severity: 1 (worst) to 10 (best)
  // Example color map: 1-3 red, 4-5 orange, 6-7 yellow, 8-9 light green, 10 green
  const severityColors: { [key: number]: string } = {
    1: "text-[#b91c1c] font-semibold", // dark red
    2: "text-[#b91c1c] font-semibold", // dark red
    3: "text-[#ef4444] font-semibold", // red
    4: "text-[#ef4444] font-semibold", // red
    5: "text-[#f87171] font-semibold", // light red
    6: "text-[#f59e42] font-semibold", // orange
    7: "text-[#fbbf24] font-semibold", // yellow-orange
    8: "text-[#bbf7d0] font-semibold", // light green
    9: "text-[#4ade80] font-semibold", // green
    10: "text-[#22c55e] font-semibold", // dark green
  };
  return severityColors[statusSeverity] || "text-[#f1f1f1]";
}

function renderTflLineStatusList(tflStatuses: TflLineStatusType[]) {
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
