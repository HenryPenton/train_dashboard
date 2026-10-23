import { useMemo } from "react";
import { APP_CONSTANTS } from "../../constants/app";
import { useFetch } from "../../hooks/useFetch";
import type { Departure, Station } from "../sections/TrainDepartures";
import { DEFAULT_TIME_DISPLAY, type TimeDisplay } from "../../stores/config";
import { EinkMessage, EinkSection } from "./EinkSection";

type EinkDeparturesProps = {
  fromStation: Station;
  toStation: Station;
  timeDisplay?: TimeDisplay;
};

function statusLabel(departure: Departure): string {
  if (departure.status === "Cancelled") return "CANCELLED";
  if (typeof departure.delay === "number" && departure.delay > 0) {
    return `DELAYED ${departure.delay} min`;
  }
  if (departure.status === "Late") return "DELAYED";
  if (departure.status === "Early") return "EARLY";
  return "On time";
}

export default function EinkDepartures({
  fromStation,
  toStation,
  timeDisplay = DEFAULT_TIME_DISPLAY,
}: EinkDeparturesProps) {
  const url = useMemo(
    () =>
      APP_CONSTANTS.API_ENDPOINTS.DEPARTURES(
        fromStation.stationCode,
        toStation.stationCode,
      ),
    [fromStation.stationCode, toStation.stationCode],
  );
  const { data, loading, error } = useFetch<Departure[]>(url);

  return (
    <EinkSection
      title={`${fromStation.stationName} to ${toStation.stationName}`}
    >
      {loading && <EinkMessage>Loading departures...</EinkMessage>}
      {error && <EinkMessage>Error: {error}</EinkMessage>}
      {!loading && !error && (!data || data.length === 0) && (
        <EinkMessage>No trains found.</EinkMessage>
      )}
      {!loading && !error && data && data.length > 0 && (
        <ul className="eink-list">
          {data.slice(0, APP_CONSTANTS.MAX_DEPARTURES).map((departure, i) => {
            const arrival =
              timeDisplay === "arrival" ? departure.arrival : undefined;
            const shown = arrival || departure.actual;
            return (
              <li key={i} className="eink-row">
                <span className="eink-time">
                  {arrival ? `Arr ${shown}` : shown}
                </span>{" "}
                <span className="eink-status">{statusLabel(departure)}</span>
                {!departure.arrival && (
                  <span className="eink-detail"> Starts here</span>
                )}
                {departure.platform && (
                  <span className="eink-detail">
                    {" "}
                    Plat {departure.platform}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </EinkSection>
  );
}
