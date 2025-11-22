import React from "react";
import { useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import { APP_CONSTANTS } from "../../constants/app";
import SectionHeading from "../common/SectionHeading";
import SectionCard from "../common/SectionCard";
import Loading from "../common/Loading";
import ErrorDisplay from "../common/ErrorDisplay";
import DepartureCard from "../common/DepartureCard";

export type DepartureStatus = "Early" | "On time" | "Late" | "Cancelled";

export interface Departure {
  scheduledDepartureTime: string;
  estimatedDepartureTime: string;
  actualDepartureTime?: string;
  status: DepartureStatus;
  platform?: string;
  operator: string;
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
  if (!departures || departures.length === 0)
    return <ErrorDisplay message={APP_CONSTANTS.ERROR_MESSAGES.NO_SERVICES} />;

  return (
    <SectionCard>
      <SectionHeading>
        🚂 {fromStation.stationName} → {toStation.stationName}
      </SectionHeading>

      <div className="space-y-3">
        {departures
          .slice(0, APP_CONSTANTS.MAX_DEPARTURES)
          .map((departure, i) => (
            <DepartureCard key={i} departure={departure} />
          ))}
      </div>
    </SectionCard>
  );
}
