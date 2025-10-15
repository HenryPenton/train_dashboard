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
  destination?: string;
  destinationTiploc?: string;
};

type ConfigType = {
  best_routes: BestRoute[];
  departures: DepartureConfig[];
};
export default function Home() {
  const [config, setConfig] = useState<ConfigType | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState("");

  // Auto-refresh the page every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch config from /api/config on mount
  useEffect(() => {
    setConfigLoading(true);
    setConfigError("");
    setConfig(null);
    fetch("/api/config")
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setConfig(data);
      })
      .catch((err) => {
        setConfigError(err.message);
      })
      .finally(() => {
        setConfigLoading(false);
      });
  }, []);

  return (
    <main className="w-full min-h-screen p-8 bg-[#181818] font-mono text-[#f8f8f2]">
      <section className="mb-8 bg-[#23262f] rounded-[12px] p-6 text-[#f1f1f1] shadow-[0_2px_12px_0_rgba(0,0,0,0.25)] max-w-[600px] mx-auto">
        <h2 className="text-xl font-semibold text-white mb-2">Config</h2>
        {configLoading && <div>Loading config...</div>}
        {configError && (
          <div className="text-[#ff4d4f] bg-[#2a1a1a] p-2 rounded mb-2">
            {configError}
          </div>
        )}
      </section>
      <h1
        className="text-center text-cyan-300 text-4xl font-bold tracking-widest mb-10 drop-shadow-[0_0_2px_white,0_0_8px_#00ffe7] font-mono border-b-4 border-yellow-200 pb-4"
        style={{ letterSpacing: "0.15em" }}
      >
        LIVE TRAIN &amp; TUBE STATUS
      </h1>

      <div className="flex w-full flex-row gap-10 flex-wrap justify-around box-border">
        <div className="flex flex-col gap-6 min-w-[320px] max-w-[600px]">
          {config &&
            config.departures.map((route, i) => {
              return route.destinationTiploc && route.destination ? (
                <TrainDepartures
                  key={i}
                  toStation={{
                    tiploc: route.destinationTiploc,
                    stationName: route.destination,
                  }}
                  fromStation={{
                    stationCode: route.originCode,
                    stationName: route.origin,
                  }}
                />
              ) : (
                <TrainDepartures
                  key={i}
                  fromStation={{
                    stationCode: route.originCode,
                    stationName: route.origin,
                  }}
                />
              );
            })}
        </div>
        <div className="flex flex-col gap-6 min-w-[320px] max-w-[600px]">
          {config &&
            config.best_routes.map((route, i) => {
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
        <div className="flex flex-col min-w-[320px] max-w-[600px]">
          <TflLineStatus />
        </div>
      </div>

      <LastRefreshed />
    </main>
  );
}
