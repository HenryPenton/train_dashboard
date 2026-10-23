import React from "react";
import { Departure } from "../sections/TrainDepartures";
import StatusBar from "./StatusBar";
import RouteInfo from "./RouteInfo";
import DepartureTime from "./DepartureTime";
import PlatformInfo from "./PlatformInfo";
import DelayInfo from "./DelayInfo";
import { DEFAULT_TIME_DISPLAY, type TimeDisplay } from "../../stores/config";
import { getDepartureStatusBarColor } from "../../utils/colorMappings";

type DepartureCardProps = {
  departure: Departure;
  timeDisplay?: TimeDisplay;
};

export default function DepartureCard({
  departure,
  timeDisplay = DEFAULT_TIME_DISPLAY,
}: DepartureCardProps) {
  const startsHere = !departure.arrival;
  const showArrival = timeDisplay === "arrival" && !startsHere;
  const time = showArrival ? departure.arrival! : departure.actual;
  const effectiveDisplay: TimeDisplay = showArrival ? "arrival" : "departure";
  const CardWrapper = departure.url ? "a" : "div";
  const cardProps = departure.url
    ? {
        href: departure.url,
        target: "_blank" as const,
        rel: "noopener noreferrer",
        className:
          "block transition-transform hover:scale-[1.02] hover:shadow-lg",
      }
    : {};

  return (
    <CardWrapper {...cardProps}>
      <div
        className="group bg-gradient-to-r from-surface-2 to-surface-3 rounded-xl border border-accent-border/30 shadow-lg overflow-hidden"
        role="article"
        aria-label={`Train departure: service ${showArrival ? "arriving" : "departing"} at ${time}, status: ${departure.status}`}
      >
        <StatusBar
          backgroundColor={getDepartureStatusBarColor(departure.status)}
        />

        <div className="p-4">
          {departure.origin && departure.destination && (
            <RouteInfo
              origin={departure.origin}
              destination={departure.destination}
              startsHere={startsHere}
            />
          )}

          <div className="flex justify-between items-start">
            <div className="flex flex-col space-y-1">
              <DepartureTime
                status={departure.status}
                time={time}
                timeDisplay={effectiveDisplay}
              />

              {departure.platform && (
                <PlatformInfo
                  platform={departure.platform}
                  timeDisplay={effectiveDisplay}
                />
              )}

              {typeof departure.delay === "number" &&
                departure.status &&
                String(departure.status).toLowerCase() !== "cancelled" && (
                  <DelayInfo delay={departure.delay} />
                )}
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
