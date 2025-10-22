"use client";

import TflLineStatus from "./components/TflLineStatus";
import TrainDepartures from "./components/TrainDepartures";
import TflBestRoute from "./components/TflBestRoute";
import LastRefreshed from "./components/LastRefreshed";
import { useEffect, useState } from "react";

type BestRoute = {
  origin: string;
  originNaptan: string;
  destination: string;
  destinationNaptan: string;
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
    const interval = setInterval(() => {
      window.location.reload();
    }, 5 * 60 * 1000);
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

      <div className="flex w-full flex-row gap-10 flex-wrap justify-around box-border">
        <div className="flex flex-col gap-6 min-w-[320px] max-w-[600px]">
          {config &&
            config.rail_departures.map((route, i) => (
              <TrainDepartures
                key={i}
                toStation={{
                  stationCode: route.destinationCode,
                  stationName: route.destination,
                }}
                fromStation={{
                  stationCode: route.originCode,
                  stationName: route.origin,
                }}
              />
            ))}
        </div>
        <div className="flex flex-col gap-6 min-w-[320px] max-w-[600px]">
          {config &&
            config.tfl_best_routes.map((route, i) => {
              return (
                <TflBestRoute
                  key={i}
                  to={{
                    placeName: route.destination,
                    naptan: route.destinationNaptan,
                  }}
                  from={{
                    placeName: route.origin,
                    naptan: route.originNaptan,
                  }}
                />
              );
            })}
        </div>
        {config?.show_tfl_lines && (
          <div className="flex flex-col min-w-[320px] max-w-[600px]">
            <TflLineStatus />
          </div>
        )}
      </div>

      <LastRefreshed />
      <div className="w-full text-center mt-10">
        <a href="/settings" className="text-cyan-300 hover:underline text-lg font-bold">Settings</a>
      </div>
    </main>
  );
}
