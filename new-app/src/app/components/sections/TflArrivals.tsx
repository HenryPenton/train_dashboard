import React from "react";
import { useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import { APP_CONSTANTS } from "../../constants/app";
import SectionHeading from "../common/SectionHeading";
import SectionCard from "../common/SectionCard";
import Loading from "../common/Loading";
import ErrorDisplay from "../common/ErrorDisplay";

type ArrivalType = {
  id: string;
  lineId: string;
  lineName: string;
  platformName: string;
  timeToStation: number;
  expectedArrival: string;
  towards: string;
  currentLocation?: string;
  destinationName?: string;
  direction?: string;
};

type LineArrivalsType = {
  lineName: string;
  arrivals: Record<string, ArrivalType[]>;
};

type StationArrivalsType = {
  lines: Record<string, LineArrivalsType>;
};

type TflArrivalsProps = {
  stationId: string;
  stationName: string;
};

export default function TflArrivals({
  stationId,
  stationName,
}: TflArrivalsProps) {
  const url = useMemo(
    () => APP_CONSTANTS.API_ENDPOINTS.ARRIVALS(stationId),
    [stationId],
  );

  const { data: arrivals, loading, error } = useFetch<StationArrivalsType>(url);

  if (loading) return <Loading message="Loading tube arrivals..." />;
  if (error) return <ErrorDisplay message={error} />;
  if (!arrivals || !arrivals.lines)
    return <ErrorDisplay message="No arrivals data available" />;

  const formatTimeToStation = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return minutes <= 0 ? "Due" : `${minutes} min`;
  };

  const transformPlatformName = (
    platformName: string,
    lineName: string,
  ): string => {
    const lowerPlatform = platformName.toLowerCase();
    const lowerLine = lineName.toLowerCase();

    if (
      lowerLine === "circle" ||
      lowerLine === "district" ||
      lowerLine === "hammersmith & city"
    ) {
      if (lowerPlatform.includes("inner")) return "Anti-Clockwise";
      if (lowerPlatform.includes("outer")) return "Clockwise";
    }

    return platformName;
  };

  return (
    <SectionCard>
      <SectionHeading>🚇 {stationName}</SectionHeading>

      <div className="space-y-6">
        {Object.entries(arrivals.lines).map(([lineId, lineData]) => (
          <div key={lineId} className="space-y-3">
            {/* Line Header */}
            <div className="text-lg font-bold text-cyan-200 border-b border-gray-600/50 pb-2">
              {lineData.lineName}
            </div>

            {/* Platforms within this line */}
            {Object.entries(lineData.arrivals).map(
              ([platformName, platformArrivals]) => (
                <div key={platformName} className="space-y-2">
                  {/* Platform Header */}
                  <div className="text-sm font-semibold text-yellow-300">
                    {transformPlatformName(platformName, lineData.lineName)}
                  </div>

                  {/* Arrivals for this platform */}
                  <div className="space-y-2">
                    {platformArrivals.slice(0, 3).map((arrival) => (
                      <div
                        key={arrival.id}
                        className="flex justify-between items-center p-3 bg-[#2a2d35] rounded border-l-4 border-yellow-500"
                      >
                        <div className="flex flex-col">
                          <div className="text-base font-medium text-white">
                            to {arrival.towards}
                          </div>
                          {arrival.currentLocation && (
                            <div className="text-xs text-gray-400">
                              {arrival.currentLocation}
                            </div>
                          )}
                        </div>
                        <div className="text-lg font-bold text-cyan-300">
                          {formatTimeToStation(arrival.timeToStation)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
