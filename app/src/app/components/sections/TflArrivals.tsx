import React from "react";
import { useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import { APP_CONSTANTS } from "../../constants/app";
import SectionHeading from "../common/SectionHeading";
import SectionCard from "../common/SectionCard";
import Loading from "../common/Loading";
import ErrorDisplay from "../common/ErrorDisplay";
import TflLineCard from "../common/TflLineCard";
import TflArrivalCard from "../common/TflArrivalCard";
import PlatformHeader from "../common/PlatformHeader";

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
      <SectionHeading fancy>{stationName}</SectionHeading>

      <div className="space-y-3">
        {Object.entries(arrivals.lines).map(([lineId, lineData]) => (
          <TflLineCard key={lineId} lineName={lineData.lineName}>
            {Object.entries(lineData.arrivals).map(
              ([platformName, platformArrivals]) => (
                <div key={platformName} className="space-y-2">
                  <PlatformHeader
                    platformName={transformPlatformName(
                      platformName,
                      lineData.lineName,
                    )}
                  />

                  <div className="space-y-2">
                    {platformArrivals.slice(0, 3).map((arrival) => (
                      <TflArrivalCard
                        key={arrival.id}
                        arrival={arrival}
                        formatTimeToStation={formatTimeToStation}
                      />
                    ))}
                  </div>
                </div>
              ),
            )}
          </TflLineCard>
        ))}
      </div>
    </SectionCard>
  );
}
