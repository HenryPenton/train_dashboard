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
import SectionHeading from "./components/common/SectionHeading";
import {
  BestRoute,
  DepartureConfig,
  TflLineStatusConfig,
  TubeDeparture,
  ConfigType,
} from "./stores/config";

type ConfigItem =
  | { type: "rail_departure"; item: DepartureConfig; col_2_position: number; col_3_position: number; importance: number }
  | { type: "tfl_best_route"; item: BestRoute; col_2_position: number; col_3_position: number; importance: number }
  | { type: "tube_departure"; item: TubeDeparture; col_2_position: number; col_3_position: number; importance: number }
  | {
      type: "tfl_line_status";
      item: TflLineStatusConfig;
      col_2_position: number;
      col_3_position: number;
      importance: number;
    };

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
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "mobile",
  );

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 1536) {
        setScreenSize("desktop");
      } else if (window.innerWidth >= 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("mobile");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  const allConfigItems: ConfigItem[] = config
    ? [
        ...config.rail_departures.map((item) => ({
          type: "rail_departure" as const,
          item,
          col_2_position: item.col_2_position,
          col_3_position: item.col_3_position,
          importance: item.importance,
        })),
        ...config.tfl_best_routes.map((item) => ({
          type: "tfl_best_route" as const,
          item,
          col_2_position: item.col_2_position,
          col_3_position: item.col_3_position,
          importance: item.importance,
        })),
        ...config.tube_departures.map((item) => ({
          type: "tube_departure" as const,
          item,
          col_2_position: item.col_2_position,
          col_3_position: item.col_3_position,
          importance: item.importance,
        })),
      ]
    : [];

  if (config?.tfl_line_status?.enabled) {
    allConfigItems.push({
      type: "tfl_line_status",
      item: config.tfl_line_status,
      col_2_position: config.tfl_line_status.col_2_position,
      col_3_position: config.tfl_line_status.col_3_position,
      importance: config.tfl_line_status.importance,
    });
  }

  const getColumnCount = () => {
    switch (screenSize) {
      case "desktop":
        return 3;
      case "tablet":
        return 2;
      case "mobile":
        return 1;
      default:
        return 1;
    }
  };

  const numColumns = getColumnCount();
  const columns: ConfigItem[][] = Array.from({ length: numColumns }, () => []);

  // Organize items by column positions based on screen size
  allConfigItems.forEach((item) => {
    let columnIndex = 0;
    if (numColumns === 2) {
      columnIndex = Math.min(item.col_2_position - 1, 1);
    } else if (numColumns === 3) {
      columnIndex = Math.min(item.col_3_position - 1, 2);
    }
    columns[columnIndex].push(item);
  });

  // Sort items within each column by importance
  columns.forEach(column => {
    column.sort((a, b) => a.importance - b.importance);
  });

  const renderConfigItem = (configItem: ConfigItem, key: string) => {
    if (configItem.type === "rail_departure") {
      return (
        <TrainDepartures
          key={key}
          toStation={{
            stationCode: configItem.item.destinationCode,
            stationName: configItem.item.destination,
          }}
          fromStation={{
            stationCode: configItem.item.originCode,
            stationName: configItem.item.origin,
          }}
        />
      );
    }

    if (configItem.type === "tfl_best_route") {
      return (
        <TflBestRoute
          key={key}
          to={{
            placeName: configItem.item.destination,
            naptanOrAtco: configItem.item.destinationNaPTANOrATCO,
          }}
          from={{
            placeName: configItem.item.origin,
            naptanOrAtco: configItem.item.originNaPTANOrATCO,
          }}
        />
      );
    }

    if (configItem.type === "tube_departure") {
      return (
        <TflArrivals
          key={key}
          stationId={configItem.item.stationId}
          stationName={configItem.item.stationName}
        />
      );
    }

    if (configItem.type === "tfl_line_status") {
      return <TflLineStatus key={key} />;
    }

    return null;
  };

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
            <SectionHeading className="mb-6 text-3xl">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-bold">
                Welcome to Train Dashboard!
              </span>
            </SectionHeading>
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
      <div className="flex gap-10 w-full justify-evenly">
        {columns.map((column, columnIndex) => (
          <div
            key={`column-${columnIndex}`}
            className="flex flex-col gap-8 flex-1 max-w-md"
          >
            {column.map((configItem, itemIndex) => {
              const key = `col-${columnIndex}-item-${itemIndex}`;
              return renderConfigItem(configItem, key);
            })}
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
