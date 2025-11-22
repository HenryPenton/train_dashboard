import React from "react";
import { Departure } from "../sections/TrainDepartures";
import StatusBar from "./StatusBar";
import RouteInfo from "./RouteInfo";
import DepartureTime from "./DepartureTime";
import PlatformInfo from "./PlatformInfo";
import DelayInfo from "./DelayInfo";

type DepartureCardProps = {
  departure: Departure;
};

export default function DepartureCard({ departure }: DepartureCardProps) {
  const CardWrapper = departure.url ? 'a' : 'div';
  const cardProps = departure.url
    ? {
        href: departure.url,
        target: "_blank" as const,
        rel: "noopener noreferrer",
        className: "block transition-transform hover:scale-[1.02] hover:shadow-lg",
      }
    : {};

  return (
    <CardWrapper {...cardProps}>
      <div className="group bg-gradient-to-r from-[#2a2d35] to-[#323741] rounded-xl border border-cyan-500/30 shadow-lg overflow-hidden">
        <StatusBar status={departure.status} />

        <div className="p-4">
          {departure.origin && departure.destination && (
            <RouteInfo origin={departure.origin} destination={departure.destination} />
          )}

          <div className="flex justify-between items-start">
            <div className="flex flex-col space-y-1">
              <DepartureTime
                status={departure.status}
                scheduledTime={departure.scheduledDepartureTime}
                estimatedTime={departure.estimatedDepartureTime}
                actualTime={departure.actual}
              />

              <div className="text-sm text-gray-300">{departure.operator}</div>

              {departure.platform && <PlatformInfo platform={departure.platform} />}

              {typeof departure.delay === "number" && (
                <DelayInfo delay={departure.delay} />
              )}
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
