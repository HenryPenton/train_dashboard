"use client";
import TflLineStatus from "./TflLineStatus";
import TrainDepartures from "./TrainDepartures";
import TflBestRoute from "./TflBestRoute";

export default function Home() {
  return (
    <main className="w-full min-h-screen p-8 bg-[#181818] border-8 border-cyan-300 rounded-none shadow-[0_0_0_8px_#222,0_0_32px_0_#00ffe7] font-mono text-[#f8f8f2]">
      <h1
        className="text-center text-cyan-300 text-4xl font-bold tracking-widest mb-10 drop-shadow-[0_0_2px_white,0_0_8px_#00ffe7] font-mono border-b-4 border-yellow-200 pb-4"
        style={{ letterSpacing: '0.15em' }}
      >
        LIVE TRAIN &amp; TUBE STATUS
      </h1>
      <div className="flex gap-10 items-start justify-between max-[900px]:flex-col max-[900px]:gap-6">
        <TrainDepartures />
        <TflLineStatus />
        <TflBestRoute />
      </div>
    </main>
  );
}
