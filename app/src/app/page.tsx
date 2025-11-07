"use client";

import { useEffect, useState } from "react";
import TrainDepartures from "./sections/rail/TrainDepartures";
import LastRefreshed from "./sections/LastRefreshed";
import TflLineStatus from "./sections/TfL/TflLineStatus";
import TflBestRoute from "./sections/TfL/TflBestRoute";

type BestRoute = {
  origin: string;
  originNaPTANOrATCO: string;
  destination: string;
  destinationNaPTANOrATCO: string;
};

type DepartureConfig = {
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
};

type ConfigType = {
  tfl_best_routes: BestRoute[];
  rail_departures: DepartureConfig[];
  show_tfl_lines: boolean;
  refresh_timer: number;
  forceRefreshTimeStamp: string;
};

const getConfig = async (): Promise<ConfigType> => {
  const res = await fetch("/api/config");
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};
export default function Home() {
  const [config, setConfig] = useState<ConfigType | null>(null);

  useEffect(() => {
    // Fetch config on mount
    getConfig().then((data) => {
      setConfig({ ...data, forceRefreshTimeStamp: new Date().toISOString() });
    });
  }, []);

  useEffect(() => {
    if (!config?.refresh_timer) return;
    const interval = setInterval(() => {
      getConfig().then((data) => {
        setConfig({ ...data, forceRefreshTimeStamp: new Date().toISOString() });
      });
    }, config.refresh_timer * 1000);
    return () => clearInterval(interval);
  }, [config?.refresh_timer]);

  const hasTrainDepartures =
    config &&
    Array.isArray(config.rail_departures) &&
    config.rail_departures.length > 0;

  const hasTflRoutes =
    config &&
    Array.isArray(config.tfl_best_routes) &&
    config.tfl_best_routes.length > 0;

  const hasTflLines = config && config.show_tfl_lines;

  let columnCount = 0;
  if (hasTrainDepartures) columnCount++;
  if (hasTflRoutes) columnCount++;
  if (hasTflLines) columnCount++;

  return (
    <main
      key={config?.forceRefreshTimeStamp || ""}
      className="w-full min-h-screen p-8 bg-[#181818] font-mono text-[#f8f8f2] relative"
    >
      <h1
        className="text-center text-cyan-300 text-4xl font-bold tracking-widest mb-10 drop-shadow-[0_0_2px_white,0_0_8px_#00ffe7] font-mono border-b-4 border-yellow-200 pb-4"
        style={{ letterSpacing: "0.15em" }}
      >
        LIVE TRAIN &amp; TUBE STATUS
      </h1>

      <div
        className={`grid w-full gap-10 box-border
          grid-cols-1
          ${columnCount >= 3 ? "2xl:grid-cols-3" : ""}
          ${columnCount >= 2 ? "lg:grid-cols-2" : ""}
          justify-items-center
          `}
      >
        {config && config.rail_departures.length > 0 && (
          <div>
            {config.rail_departures.map((route, i) => (
              <div key={i} className="mb-8 last:mb-0">
                <TrainDepartures
                  toStation={{
                    stationCode: route.destinationCode,
                    stationName: route.destination,
                  }}
                  fromStation={{
                    stationCode: route.originCode,
                    stationName: route.origin,
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {config && config.tfl_best_routes.length > 0 && (
          <div>
            {config.tfl_best_routes.map((route, i) => (
              <div key={i} className="mb-8 last:mb-0">
                <TflBestRoute
                  to={{
                    placeName: route.destination,
                    naptanOrAtco: route.destinationNaPTANOrATCO,
                  }}
                  from={{
                    placeName: route.origin,
                    naptanOrAtco: route.originNaPTANOrATCO,
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {config?.show_tfl_lines ? (
          <div className="">
            <TflLineStatus />
          </div>
        ) : null}
      </div>
      {config?.forceRefreshTimeStamp ? (
        <LastRefreshed dateTimeString={config.forceRefreshTimeStamp} />
      ) : null}
      <div className="w-full text-center mt-10 flex flex-col items-center gap-2">
        <a
          href="/settings"
          className="text-cyan-300 hover:underline text-lg font-bold"
        >
          Settings
        </a>
        <a
          href="/schedules"
          className="text-yellow-300 hover:underline text-lg font-bold"
        >
          Schedules
        </a>
      </div>
    </main>
  );
}
