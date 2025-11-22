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
        {fromStation.stationName} → {toStation.stationName}
      </SectionHeading>

      <div className="space-y-3">
        {departures
          .slice(0, APP_CONSTANTS.MAX_DEPARTURES)
          .map((departure, i) => {
            const DepartureCard = departure.url ? "a" : "div";
            const cardProps = departure.url
              ? {
                  href: departure.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className:
                    "block transition-transform hover:scale-[1.02] hover:shadow-lg",
                }
              : {};

            const getDelayColor = () => {
              if (typeof departure.delay === "number") {
                if (departure.delay > 0) return "text-red-400";
                if (departure.delay === 0) return "text-green-400";
              }
              return "text-gray-300";
            };

            return (
              <DepartureCard key={i} {...cardProps}>
                <div className="bg-gradient-to-r from-[#2a2d35] to-[#323741] rounded-xl border border-cyan-500/30 shadow-lg overflow-hidden">
                  {/* Status Bar */}
                  <div
                    className={`h-1 w-full ${
                      departure.status === "On time"
                        ? "bg-green-500"
                        : departure.status === "Early"
                          ? "bg-blue-500"
                          : departure.status === "Late"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    }`}
                  ></div>

                  <div className="p-4">
                    {/* Route Information */}
                    {departure.origin && departure.destination && (
                      <div className="mb-2 text-sm text-cyan-300 font-medium">
                        <span className="font-bold">{departure.origin}</span>
                        <span className="mx-2 text-cyan-400">→</span>
                        <span className="font-bold">
                          {departure.destination}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-start">
                      <div className="flex flex-col space-y-1">
                        {/* Departure Time */}
                        <div className="text-lg font-bold text-cyan-200">
                          <span className="text-gray-400 font-normal">
                            Departs:{" "}
                          </span>
                          {departure.status === "Cancelled" ? (
                            <span className="text-red-400 line-through">
                              CANCELLED
                            </span>
                          ) : (
                            <>
                              {departure.actual ||
                                departure.scheduledDepartureTime}
                              {departure.estimatedDepartureTime !==
                                departure.scheduledDepartureTime &&
                                !departure.actual && (
                                  <span className="ml-2 text-yellow-300">
                                    ({departure.estimatedDepartureTime})
                                  </span>
                                )}
                            </>
                          )}
                        </div>

                        {/* Operator */}
                        <div className="text-sm text-gray-300">
                          {departure.operator}
                        </div>

                        {/* Platform Information */}
                        {departure.platform && (
                          <div className="text-sm">
                            <span className="text-gray-400">Platform: </span>
                            <span className="text-gray-300 font-semibold">
                              {departure.platform}
                            </span>
                          </div>
                        )}

                        {/* Delay Information */}
                        {typeof departure.delay === "number" && (
                          <div className="text-sm">
                            <span className="text-gray-400">Delay: </span>
                            <span
                              className={`font-semibold ${getDelayColor()}`}
                            >
                              {departure.delay === 0
                                ? "On time"
                                : `${departure.delay} min`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </DepartureCard>
            );
          })}
      </div>
    </SectionCard>
  );
}
