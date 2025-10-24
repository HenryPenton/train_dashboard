import { useEffect, useState } from "react";
import { FrontEndLineStatuses } from "../../../validators/frontend-validators/LineStatusSchema";
import TflLineStatusList from "./TflLineStatusList";

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

        const data = await res.json();
        const validated = FrontEndLineStatuses.parse(data);
        setTflStatuses(validated);
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
  {tflStatuses && <TflLineStatusList tflStatuses={tflStatuses} />}
    </section>
  );
}

