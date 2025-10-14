"use client";
import TflLineStatus from "./TflLineStatus";
import TrainDepartures from "./TrainDepartures";
import TflBestRoute from "./TflBestRoute";

export default function Home() {
  return (
    <main className="w-full p-8 bg-[#181a20] box-border shadow-[0_4px_32px_0_rgba(0,0,0,0.66)]">
      <h1
        className="text-center text-white text-[2.2rem] font-bold tracking-wide mb-6"
        style={{ letterSpacing: "0.01em" }}
      >
        Live Train &amp; Tube Status
      </h1>
      <div className="flex gap-10 items-start justify-between max-[900px]:flex-col max-[900px]:gap-6">
        <TrainDepartures />
        <TflLineStatus />
        <TflBestRoute />
      </div>
    </main>
  );
}
