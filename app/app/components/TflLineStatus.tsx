import { useState, useEffect } from "react";

type TflLineStatusType = {
  name: string;
  status: string | null;
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
    <section className="bg-[#23262f] rounded-[12px] p-6 text-[#f1f1f1] shadow-[0_2px_12px_0_rgba(0,0,0,0.25)]">
      <h2 className="text-xl font-semibold text-white mb-2">TFL Line Status</h2>
      {tflLoading && <div>Loading TFL line statuses...</div>}
      {tflError && (
        <div className="text-[#ff4d4f] bg-[#2a1a1a] p-2 rounded mb-2">
          {tflError}
        </div>
      )}
      {tflStatuses && renderTflLineStatusList(tflStatuses)}
    </section>
  );
}

function renderTflLineStatusList(tflStatuses: TflLineStatusType[]) {
  return (
    <ul>
      {tflStatuses.map((line, i) => {
        let statusClass = "";
        if (line.status === "Good Service")
          statusClass = "text-[#4ade80] font-semibold";
        else if (
          line.status &&
          line.status.toLowerCase().includes("minor delay")
        )
          statusClass = "text-[#fbbf24] font-semibold";
        else if (line.status && line.status !== "Good Service")
          statusClass = "text-[#f87171] font-semibold";
        return (
          <li
            key={i}
            className="mb-3 text-[1.08rem]"
            style={{ letterSpacing: "0.01em" }}
          >
            <strong>{line.name}</strong>:{" "}
            <span className={statusClass}>{line.status || "Unknown"}</span>
          </li>
        );
      })}
    </ul>
  );
}
