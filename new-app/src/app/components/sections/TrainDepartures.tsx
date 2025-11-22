import React from "react";
import { useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import { APP_CONSTANTS } from "../../constants/app";
import SectionHeading from "../common/SectionHeading";
import SectionCard from "../common/SectionCard";
import Loading from "../common/Loading";
import ErrorDisplay from "../common/ErrorDisplay";

export type DepartureStatus = "Early" | "On time" | "Late" | "Cancelled";

export interface Departure {
  scheduledDepartureTime: string;
  estimatedDepartureTime: string;
  actualDepartureTime?: string;
  status: DepartureStatus;
  platform?: string;
  operator: string;
  serviceId: string;
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
        {departures.slice(0, APP_CONSTANTS.MAX_DEPARTURES).map((departure, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-[#2a2d35] rounded border-l-4 border-cyan-500">
            <div className="flex flex-col">
              <div className="text-lg font-bold text-cyan-200">
                {departure.scheduledDepartureTime}
                {departure.estimatedDepartureTime !== departure.scheduledDepartureTime && (
                  <span className="ml-2 text-yellow-300">
                    ({departure.estimatedDepartureTime})
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-300">
                {departure.operator}
                {departure.platform && ` • Platform ${departure.platform}`}
              </div>
            </div>
            <div className={`px-3 py-1 rounded text-sm font-semibold ${
              departure.status === "On time" ? "bg-green-600" :
              departure.status === "Early" ? "bg-blue-600" :
              departure.status === "Late" ? "bg-yellow-600" :
              "bg-red-600"
            }`}>
              {departure.status}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}