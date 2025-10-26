"use client";

import TflLineStatus from "./components/TfL/lines/TflLineStatus";
import TrainDepartures from "./components/departures/TrainDepartures";
import TflBestRoute from "./components/TfL/route/TflBestRoute";
import LastRefreshed from "./components/LastRefreshed";
import { useEffect, useState } from "react";

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
};
export default function Home() {
  const [config, setConfig] = useState<ConfigType | null>(null);

  // Auto-refresh the page every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        window.location.reload();
      },
      5 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, []);

  // Fetch config from /api/config on mount
  useEffect(() => {
    fetch("/api/config")
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setConfig(data);
      });
  }, []);

  return (
    <main className="w-full min-h-screen p-8 bg-[#181818] font-mono text-[#f8f8f2] relative">
      <h1
        className="text-center text-cyan-300 text-4xl font-bold tracking-widest mb-10 drop-shadow-[0_0_2px_white,0_0_8px_#00ffe7] font-mono border-b-4 border-yellow-200 pb-4"
        style={{ letterSpacing: "0.15em" }}
      >
        LIVE TRAIN &amp; TUBE STATUS
      </h1>

      <div
        className={`grid w-full gap-10 box-border
          grid-cols-1
          lg:grid-cols-2
          ${config?.show_tfl_lines ? "2xl:grid-cols-3" : ""}
          justify-items-center`}
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
          <div className="lg:col-span-2 2xl:col-span-1">
            <TflLineStatus />
          </div>
        ) : null}
      </div>

      <LastRefreshed />
      <div className="w-full text-center mt-10">
        <a
          href="/settings"
          className="text-cyan-300 hover:underline text-lg font-bold"
        >
          Settings
        </a>
      </div>
    </main>
  );
}
