"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConfigStore } from "./providers/config";
import PageLayout from "./components/layout/PageLayout";
import Loading from "./components/common/Loading";
import TrainDepartures from "./components/sections/TrainDepartures";
import TflArrivals from "./components/sections/TflArrivals";
import TflBestRoute from "./components/sections/TflBestRoute";
import TflLineStatus from "./components/sections/TflLineStatus";
import SectionCard from "./components/common/SectionCard";
import {
  BestRoute,
  DepartureConfig,
  TflLineStatusConfig,
  TubeDeparture,
  ConfigType,
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

// Helper function to check if config is effectively blank
const isConfigBlank = (config: ConfigType | null) => {
  if (!config) return true;

  const hasRailDepartures = config.rail_departures?.length > 0;
  const hasTflRoutes = config.tfl_best_routes?.length > 0;
  const hasTubeDepartures = config.tube_departures?.length > 0;
  const hasTflLineStatus = config.tfl_line_status?.enabled;

  return (
    !hasRailDepartures &&
    !hasTflRoutes &&
    !hasTubeDepartures &&
    !hasTflLineStatus
  );
};

export default function Home() {
  const { config, fetchConfig, lastRefreshTimeStamp, forceRefresh } =
    useConfigStore((state) => state);

  const [configLoading, setConfigLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    fetchConfig().finally(() => {
      if (mounted) setConfigLoading(false);
    });
    return () => {
      mounted = false;
    };
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

  // Show welcome message if config is blank
  if (configLoading) {
    return (
      <PageLayout
        title="LIVE TRAIN &amp; TUBE STATUS"
        lastRefreshTimeStamp={lastRefreshTimeStamp}
        showNavigation={true}
      >
        <div className="max-w-4xl mx-auto">
          <Loading message="Loading configuration..." />
        </div>
      </PageLayout>
    );
  }

  if (isConfigBlank(config)) {
    return (
      <PageLayout
        title="LIVE TRAIN &amp; TUBE STATUS"
        lastRefreshTimeStamp={lastRefreshTimeStamp}
        showNavigation={true}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <SectionCard className="max-w-2xl text-center p-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              Welcome to Train Dashboard!
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              To get started, you&apos;ll need to configure your train and tube
              routes, departures, and line status preferences in the settings
              page.
            </p>
            <Link
              href="/settings"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Go to Settings
            </Link>
            <p className="text-gray-400 text-sm mt-6">
              You can access settings anytime by clicking the link in the
              navigation footer.
            </p>
          </SectionCard>
        </div>
      </PageLayout>
    );
  }

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
