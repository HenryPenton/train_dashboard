"use client";

import { useEffect } from "react";
import { useConfigStore } from "./providers/config";
import LastRefreshed from "./sections/LastRefreshed";
import TrainDepartures from "./sections/rail/TrainDepartures";
import TflBestRoute from "./sections/TfL/TflBestRoute";
import TflLineStatus from "./sections/TfL/TflLineStatus";
import TflArrivals from "./sections/TfL/TflArrivals";

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

  const hasTrainDepartures = config && config.rail_departures.length > 0;
  const hasTflRoutes = config && config.tfl_best_routes.length > 0;
  const hasTflLines = config && config.show_tfl_lines;
  const hasTubeDepartures = config && config.tube_departures.length > 0;

  let columnCount = 0;
  if (hasTrainDepartures) columnCount++;
  if (hasTflRoutes) columnCount++;
  if (hasTflLines) columnCount++;
  if (hasTubeDepartures) columnCount++;

  return (
    <main
      key={lastRefreshTimeStamp || ""}
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

        {config && config.tube_departures.length > 0 && (
          <div>
            {config.tube_departures.map((station, i) => (
              <div key={i} className="mb-8 last:mb-0">
                <TflArrivals
                  stationId={station.stationId}
                  stationName={station.stationName}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {lastRefreshTimeStamp ? (
        <LastRefreshed dateTimeString={lastRefreshTimeStamp} />
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
