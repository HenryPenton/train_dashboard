import { useMemo } from "react";
import { FrontEndRailDeparturesSchema } from "../../validators/frontend-validators/RailDepartureSchema";
import { APP_CONSTANTS } from "../../constants/app";
import { useFetch } from "../../hooks/useFetch";
import Loading from "../../components/text/Loading";
import SectionHeading from "../../components/text/SectionHeading";
import DepartureError from "../../components/RailDepartures/DepartureError";
import DepartureList from "../../components/RailDepartures/DepartureList";

export type DepartureStatus = "Early" | "On time" | "Late" | "Cancelled";

export interface Departure {
  url: string;
  origin: string;
  destination: string;
  actual: string;
  platform: string;
  delay: number;
  status: DepartureStatus;
}

export interface Station {
  stationName: string;
  stationCode: string;
}

type TrainDepartureProps = {
  fromStation: Station;
  toStation: Station;
};

export default function TrainDepartures({ fromStation, toStation }: TrainDepartureProps) {
  const url = useMemo(() => 
    APP_CONSTANTS.API_ENDPOINTS.DEPARTURES(fromStation.stationCode, toStation.stationCode),
    [fromStation.stationCode, toStation.stationCode]
  );

  const { data: rawDepartures, loading, error } = useFetch<Departure[]>(url);

  const departures = useMemo(() => {
    if (!rawDepartures) return null;
    const validated = FrontEndRailDeparturesSchema.parse(rawDepartures);
    return validated.slice(0, APP_CONSTANTS.MAX_DEPARTURES);
  }, [rawDepartures]);

  return (
    <section
      className="flex-1 bg-[#23262f] rounded-[12px] p-6 text-[#f1f1f1] shadow-[0_2px_12px_0_rgba(0,0,0,0.25)]"
      aria-label="Train Departures Section"
    >
      <SectionHeading className="text-white">Train Departures</SectionHeading>
      <div style={{ marginBottom: 16 }}>
        <span aria-label="Departure route">
          <strong>
            Departures from {fromStation.stationName} to {toStation.stationName}
          </strong>
        </span>
        {loading && <Loading />}
      </div>
      {error && (
        <DepartureError message="Could not find any services for the configured route." />
      )}
      {departures && <DepartureList departures={departures} />}
    </section>
  );
}
