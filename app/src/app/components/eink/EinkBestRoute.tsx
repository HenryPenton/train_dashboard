import { useMemo } from "react";
import { APP_CONSTANTS } from "../../constants/app";
import { useFetch } from "../../hooks/useFetch";
import { BestRouteData, Place } from "../../types/route";
import { EinkMessage, EinkSection } from "./EinkSection";

type EinkBestRouteProps = {
  from: Place;
  to: Place;
};

const formatClock = (iso: string) => {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function EinkBestRoute({ from, to }: EinkBestRouteProps) {
  const url = useMemo(
    () =>
      APP_CONSTANTS.API_ENDPOINTS.BEST_ROUTE(
        from.naptanOrAtco,
        to.naptanOrAtco,
      ),
    [from.naptanOrAtco, to.naptanOrAtco],
  );
  const { data, loading, error } = useFetch<BestRouteData>(url);

  return (
    <EinkSection title={`Route: ${from.placeName} to ${to.placeName}`}>
      {loading && <EinkMessage>Finding route...</EinkMessage>}
      {error && <EinkMessage>Error: {error}</EinkMessage>}
      {!loading && !error && !data && (
        <EinkMessage>No route data available.</EinkMessage>
      )}
      {!loading && !error && data && (
        <>
          <p className="eink-row">
            <span className="eink-time">{data.duration} min</span>, arrive{" "}
            {formatClock(data.arrival)}
            {typeof data.fare === "number" &&
              `, fare £${(data.fare / 100).toFixed(2)}`}
          </p>
          <ol className="eink-list">
            {data.legs.map((leg, i) => (
              <li key={i} className="eink-row">
                {formatClock(leg.departure)} {leg.instruction}
                {leg.line && <span className="eink-detail"> ({leg.line})</span>}
              </li>
            ))}
          </ol>
        </>
      )}
    </EinkSection>
  );
}
