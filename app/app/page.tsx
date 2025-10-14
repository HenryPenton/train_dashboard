"use client";
import TflLineStatus from "./TflLineStatus";
import TrainDepartures from "./TrainDepartures";
import TflBestRoute from "./TflBestRoute";

export default function Home() {
  return (
  <main className="w-full min-h-screen p-8 bg-[#181818] font-mono text-[#f8f8f2]">
      <h1
        className="text-center text-cyan-300 text-4xl font-bold tracking-widest mb-10 drop-shadow-[0_0_2px_white,0_0_8px_#00ffe7] font-mono border-b-4 border-yellow-200 pb-4"
        style={{ letterSpacing: "0.15em" }}
      >
        LIVE TRAIN &amp; TUBE STATUS
      </h1>
      <div className="flex gap-10 items-start justify-between max-[900px]:flex-col max-[900px]:gap-6">
        <TrainDepartures
          toStation={{
            tiploc: "PADTON",
            stationName: "London Paddington",
          }}
          fromStation={{ stationCode: "RDG", stationName: "Reading" }}
        />

        <TflLineStatus />
        <div className="flex flex-col gap-4 w-full max-w-md">
          <TflBestRoute
            to={{ placeName: "Paddington", naptan: "940GZZLUPAC" }}
            from={{ placeName: "Tooting", naptan: "940GZZLUTBY" }}
          />
          <TflBestRoute
            from={{ placeName: "Paddington", naptan: "940GZZLUPAC" }}
            to={{ placeName: "Tooting", naptan: "940GZZLUTBY" }}
          />
        </div>
      </div>
    </main>
  );
}
