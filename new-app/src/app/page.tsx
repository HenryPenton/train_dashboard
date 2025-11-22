"use client";

import { useEffect } from "react";
import { useConfigStore } from "./providers/config";
import PageLayout from "./components/layout/PageLayout";
import TrainDepartures from "./components/sections/TrainDepartures";
import TflArrivals from "./components/sections/TflArrivals";
import TflBestRoute from "./components/sections/TflBestRoute";
import TflLineStatus from "./components/sections/TflLineStatus";
import {
  BestRoute,
  DepartureConfig,
  TflLineStatusConfig,
  TubeDeparture,
} from "./stores/config";

type ConfigItem =
  | { type: "rail_departure"; item: DepartureConfig; importance: number }
  | { type: "tfl_best_route"; item: BestRoute; importance: number }
  | { type: "tube_departure"; item: TubeDeparture; importance: number }
  | {
      type: "tfl_line_status";
      item: TflLineStatusConfig;
      importance: number;
    };

export default function Home() {
  const { config, fetchConfig, lastRefreshTimeStamp, forceRefresh } =
    useConfigStore((state) => state);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (!config?.refresh_timer) return;
    const interval = setInterval(() => {
      forceRefresh();
    }, config.refresh_timer * 1000);
    return () => clearInterval(interval);
  }, [config?.refresh_timer, forceRefresh]);

  // Create a unified array of all config items with their types and importance
  const allConfigItems: ConfigItem[] = config
    ? [
        ...config.rail_departures.map((item) => ({
          type: "rail_departure" as const,
          item,
          importance: item.importance,
        })),
        ...config.tfl_best_routes.map((item) => ({
          type: "tfl_best_route" as const,
          item,
          importance: item.importance,
        })),
        ...config.tube_departures.map((item) => ({
          type: "tube_departure" as const,
          item,
          importance: item.importance,
        })),
      ]
    : [];

  // Add TfL line status if enabled
  if (config?.tfl_line_status?.enabled) {
    allConfigItems.push({
      type: "tfl_line_status",
      item: config.tfl_line_status,
      importance: config.tfl_line_status.importance,
    });
  }

  // Sort all items globally by importance
  const sortedConfigItems = allConfigItems.sort((a, b) => {
    // Items with importance come first, sorted by importance (1 = highest priority)
    // Items without importance come last
    if (a.importance && b.importance) return a.importance - b.importance;
    if (a.importance && !b.importance) return -1;
    if (!a.importance && b.importance) return 1;
    return 0; // Both have no importance, maintain original order
  });

  const columnCount = sortedConfigItems.length;

  return (
    <PageLayout 
      title="LIVE TRAIN &amp; TUBE STATUS" 
      lastRefreshTimeStamp={lastRefreshTimeStamp}
      showNavigation={true}
    >
      <div
        className={`grid w-full gap-10 box-border
          grid-cols-1
          ${columnCount >= 3 ? "2xl:grid-cols-3" : ""}
          ${columnCount >= 2 ? "lg:grid-cols-2" : ""}
          justify-items-center
          `}
      >
        {sortedConfigItems.map((configItem, i) => {
          if (configItem.type === "rail_departure") {
            return (
              <div key={`rail-${i}`} className="mb-8 last:mb-0">
                <TrainDepartures
                  toStation={{
                    stationCode: configItem.item.destinationCode,
                    stationName: configItem.item.destination,
                  }}
                  fromStation={{
                    stationCode: configItem.item.originCode,
                    stationName: configItem.item.origin,
                  }}
                />
              </div>
            );
          }

          if (configItem.type === "tfl_best_route") {
            return (
              <div key={`tfl-route-${i}`} className="mb-8 last:mb-0">
                <TflBestRoute
                  to={{
                    placeName: configItem.item.destination,
                    naptanOrAtco: configItem.item.destinationNaPTANOrATCO,
                  }}
                  from={{
                    placeName: configItem.item.origin,
                    naptanOrAtco: configItem.item.originNaPTANOrATCO,
                  }}
                />
              </div>
            );
          }

          if (configItem.type === "tube_departure") {
            return (
              <div key={`tube-${i}`} className="mb-8 last:mb-0">
                <TflArrivals
                  stationId={configItem.item.stationId}
                  stationName={configItem.item.stationName}
                />
              </div>
            );
          }

          if (configItem.type === "tfl_line_status") {
            return (
              <div key={`tfl-lines-${i}`} className="mb-8 last:mb-0">
                <TflLineStatus />
              </div>
            );
          }

          return null;
        })}
      </div>
    </PageLayout>
  );
}
