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

export default function TflArrivals({ stationId, stationName }: TflArrivalsProps) {
  const url = useMemo(
    () => APP_CONSTANTS.API_ENDPOINTS.ARRIVALS(stationId),
    [stationId]
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

  const transformPlatformName = (platformName: string, lineName: string): string => {
    const lowerPlatform = platformName.toLowerCase();
    const lowerLine = lineName.toLowerCase();
    
    if (lowerLine === "circle" || lowerLine === "district" || lowerLine === "hammersmith & city") {
      if (lowerPlatform.includes("inner")) return "Anti-Clockwise";
      if (lowerPlatform.includes("outer")) return "Clockwise";
    }
    
    return platformName;
  };

  // Flatten all arrivals from all lines and platforms
  const allArrivals: (ArrivalType & { transformedPlatform: string })[] = [];
  
  Object.values(arrivals.lines).forEach((line) => {
    Object.entries(line.arrivals).forEach(([platformName, platformArrivals]) => {
      platformArrivals.forEach((arrival) => {
        allArrivals.push({
          ...arrival,
          transformedPlatform: transformPlatformName(platformName, arrival.lineName)
        });
      });
    });
  });

  // Sort by time to station
  allArrivals.sort((a, b) => a.timeToStation - b.timeToStation);

  return (
    <SectionCard>
      <SectionHeading>
        🚇 {stationName}
      </SectionHeading>
      
      <div className="space-y-3">
        {allArrivals.slice(0, APP_CONSTANTS.MAX_DEPARTURES).map((arrival) => (
          <div key={arrival.id} className="flex justify-between items-center p-3 bg-[#2a2d35] rounded border-l-4 border-yellow-500">
            <div className="flex flex-col">
              <div className="text-lg font-bold text-yellow-200">
                {arrival.lineName}
              </div>
              <div className="text-sm text-gray-300">
                to {arrival.towards}
                {arrival.transformedPlatform && ` • ${arrival.transformedPlatform}`}
              </div>
            </div>
            <div className="text-lg font-bold text-cyan-300">
              {formatTimeToStation(arrival.timeToStation)}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}