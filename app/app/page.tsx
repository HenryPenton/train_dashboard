"use client";

import TflLineStatus from "./components/TflLineStatus";
import TrainDepartures from "./components/TrainDepartures";
import TflBestRoute from "./components/TflBestRoute";
import LastRefreshed from "./components/LastRefreshed";
import { useEffect } from "react";

export default function Home() {
  // Auto-refresh the page every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="w-full min-h-screen p-8 bg-[#181818] font-mono text-[#f8f8f2]">
      <h1
        className="text-center text-cyan-300 text-4xl font-bold tracking-widest mb-10 drop-shadow-[0_0_2px_white,0_0_8px_#00ffe7] font-mono border-b-4 border-yellow-200 pb-4"
        style={{ letterSpacing: "0.15em" }}
      >
        LIVE TRAIN &amp; TUBE STATUS
      </h1>

      <div className="flex w-full flex-row gap-10 flex-wrap justify-around box-border">
        <div className="flex flex-col gap-6 min-w-[320px] max-w-[600px]">
          <TrainDepartures
            toStation={{
              tiploc: process.env.NEXT_PUBLIC_TRAIN_TO_ONE_TIPLOC || "",
              stationName: process.env.NEXT_PUBLIC_TRAIN_TO_ONE || "",
            }}
            fromStation={{
              stationCode: process.env.NEXT_PUBLIC_TRAIN_FROM_ONE_CODE || "",
              stationName: process.env.NEXT_PUBLIC_TRAIN_FROM_ONE || "",
            }}
          />
          <TrainDepartures
            fromStation={{
              stationCode: process.env.NEXT_PUBLIC_TRAIN_FROM_TWO_CODE || "",
              stationName: process.env.NEXT_PUBLIC_TRAIN_FROM_TWO || "",
            }}
          />
        </div>
        <div className="flex flex-col gap-6 min-w-[320px] max-w-[600px]">
          <TflBestRoute
            to={{
              placeName: process.env.NEXT_PUBLIC_BEST_ROUTE_TWO || "",
              naptan: process.env.NEXT_PUBLIC_BEST_ROUTE_TWO_NAPTAN || "",
            }}
            from={{
              placeName: process.env.NEXT_PUBLIC_BEST_ROUTE_ONE || "",
              naptan: process.env.NEXT_PUBLIC_BEST_ROUTE_ONE_NAPTAN || "",
            }}
          />
          <TflBestRoute
            from={{
              placeName: process.env.NEXT_PUBLIC_BEST_ROUTE_TWO || "",
              naptan: process.env.NEXT_PUBLIC_BEST_ROUTE_TWO_NAPTAN || "",
            }}
            to={{
              placeName: process.env.NEXT_PUBLIC_BEST_ROUTE_ONE || "",
              naptan: process.env.NEXT_PUBLIC_BEST_ROUTE_ONE_NAPTAN || "",
            }}
          />
        </div>
        <div className="flex flex-col min-w-[320px] max-w-[600px]">
          <TflLineStatus />
        </div>
      </div>

      <LastRefreshed />
    </main>
  );
}
