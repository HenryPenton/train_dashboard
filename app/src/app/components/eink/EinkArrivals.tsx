import { useMemo } from "react";
import { APP_CONSTANTS } from "../../constants/app";
import { useFetch } from "../../hooks/useFetch";
import { EinkMessage, EinkSection } from "./EinkSection";

type Arrival = {
  id: string;
  towards: string;
  timeToStation: number;
};

type StationArrivals = {
  lines: Record<
    string,
    { lineName: string; arrivals: Record<string, Arrival[]> }
  >;
};

type EinkArrivalsProps = {
  stationId: string;
  stationName: string;
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return minutes <= 0 ? "Due" : `${minutes} min`;
};

export default function EinkArrivals({
  stationId,
  stationName,
}: EinkArrivalsProps) {
  const url = useMemo(
    () => APP_CONSTANTS.API_ENDPOINTS.ARRIVALS(stationId),
    [stationId],
  );
  const { data, loading, error } = useFetch<StationArrivals>(url);

  return (
    <EinkSection title={stationName}>
      {loading && <EinkMessage>Loading arrivals...</EinkMessage>}
      {error && <EinkMessage>Error: {error}</EinkMessage>}
      {!loading && !error && (!data || !data.lines) && (
        <EinkMessage>No arrivals data available.</EinkMessage>
      )}
      {!loading &&
        !error &&
        data?.lines &&
        Object.entries(data.lines).map(([lineId, line]) => (
          <div key={lineId} className="eink-group">
            <h3 className="eink-group-title">{line.lineName}</h3>
            {Object.entries(line.arrivals).map(([platform, arrivals]) => (
              <div key={platform}>
                <div className="eink-detail">{platform}</div>
                <ul className="eink-list">
                  {arrivals.slice(0, 3).map((arrival) => (
                    <li key={arrival.id} className="eink-row">
                      <span className="eink-time">
                        {formatTime(arrival.timeToStation)}
                      </span>{" "}
                      to {arrival.towards}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
    </EinkSection>
  );
}
