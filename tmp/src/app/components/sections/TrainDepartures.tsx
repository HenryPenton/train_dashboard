import Link from "next/link";
import { useMemo } from "react";
import { APP_CONSTANTS } from "../../constants/app";
import { useFetch } from "../../hooks/useFetch";
import DepartureCard from "../common/DepartureCard";
import ErrorDisplay from "../common/ErrorDisplay";
import Loading from "../common/Loading";
import NoTrainsCard from "../common/NoTrainsCard";
import SectionCard from "../common/SectionCard";
import SectionHeading from "../common/SectionHeading";

export type DepartureStatus = "Early" | "On time" | "Late" | "Cancelled";

export interface Departure {
  scheduledDepartureTime: string;
  estimatedDepartureTime: string;
  actualDepartureTime?: string;
  status: DepartureStatus;
  platform?: string;
  serviceId: string;
  url?: string;
  origin?: string;
  destination?: string;
  delay?: number;
  actual?: string;
}

export interface Station {
  stationCode: string;
  stationName: string;
}

type TrainDepartureProps = {
  fromStation: Station;
  toStation: Station;
};

export default function TrainDepartures({
  fromStation,
  toStation,
}: TrainDepartureProps) {
  const url = useMemo(
    () =>
      APP_CONSTANTS.API_ENDPOINTS.DEPARTURES(
        fromStation.stationCode,
        toStation.stationCode,
      ),
    [fromStation.stationCode, toStation.stationCode],
  );

  const { data: departures, loading, error } = useFetch<Departure[]>(url);

  if (loading) return <Loading message="Loading departures..." />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <SectionCard>
      <SectionHeading>
        <Link
          target="_blank"
          href={`https://www.realtimetrains.co.uk/search/simple/gb-nr:${fromStation.stationCode}/to/gb-nr:${toStation.stationCode}`}
        >
          {fromStation.stationName} → {toStation.stationName}
        </Link>
      </SectionHeading>

      <div className="space-y-3">
        {!departures || departures.length === 0 ? (
          <NoTrainsCard fromStation={fromStation} toStation={toStation} />
        ) : (
          departures
            .slice(0, APP_CONSTANTS.MAX_DEPARTURES)
            .map((departure, i) => (
              <DepartureCard key={i} departure={departure} />
            ))
        )}
      </div>
    </SectionCard>
  );
}
