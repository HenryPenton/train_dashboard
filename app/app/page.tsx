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
      <div
        className="flex gap-10 items-start justify-between
      max-[1650px]:flex-col max-[1650px]:gap-10 max-[1650px]:w-full max-[1650px]:mx-0
      max-[1200px]:gap-6 max-[1200px]:w-[95%] max-[1200px]:mx-auto"
      >
        <div className="flex w-full gap-10 max-[1200px]:flex-col max-[1200px]:gap-6 max-[1200px]:w-full max-[1650px]:w-full max-[1650px]:mx-0">
          <div className="flex flex-col gap-6 w-full">
            <TrainDepartures
              toStation={{
                tiploc: "PADTON",
                stationName: "London Paddington",
              }}
              fromStation={{ stationCode: "RDG", stationName: "Reading" }}
            />
            <TrainDepartures
              fromStation={{ stationCode: "PAD", stationName: "Paddington" }}
            />
          </div>
          <div className="flex flex-col gap-6 w-full max-w-md max-[1200px]:w-full max-[1200px]:mx-0">
            <TflBestRoute
              to={{ placeName: "Paddington", naptan: "940GZZLUPAC" }}
              from={{ placeName: "Tooting", naptan: "940GZZLUTBY" }}
            />
            <TflBestRoute
              from={{ placeName: "Paddington", naptan: "940GZZLUPAC" }}
              to={{ placeName: "Tooting", naptan: "940GZZLUTBY" }}
            />
          </div>
          <div className="w-full flex flex-col justify-stretch">
            <TflLineStatus />
          </div>
        </div>
      </div>
    </main>
  );
}
