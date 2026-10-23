import { APP_CONSTANTS } from "../../constants/app";
import { useFetch } from "../../hooks/useFetch";
import { EinkMessage, EinkSection } from "./EinkSection";

type LineStatus = {
  name: string;
  statuses: { status: string; reason?: string | null }[];
  statusSeverity: number;
};

export default function EinkLineStatus() {
  const { data, loading, error } = useFetch<LineStatus[]>(
    APP_CONSTANTS.API_ENDPOINTS.LINE_STATUS,
  );

  return (
    <EinkSection title="TfL Line Status">
      {loading && <EinkMessage>Loading line status...</EinkMessage>}
      {error && <EinkMessage>Error: {error}</EinkMessage>}
      {!loading && !error && (!data || data.length === 0) && (
        <EinkMessage>No line status data available.</EinkMessage>
      )}
      {!loading && !error && data && data.length > 0 && (
        <ul className="eink-list">
          {data.map((line, i) => {
            const labels =
              line.statuses && line.statuses.length > 0
                ? line.statuses.map((s) => s.status).join(", ")
                : "Unknown";
            const good = labels.toLowerCase() === "good service";
            return (
              <li key={i} className="eink-row">
                <span className="eink-time">{line.name}</span>:{" "}
                <span className="eink-status">
                  {good ? labels : labels.toUpperCase()}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </EinkSection>
  );
}
