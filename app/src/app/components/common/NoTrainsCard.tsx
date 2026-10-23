import React, { useState } from "react";
import Link from "next/link";
import { Station } from "../sections/TrainDepartures";

const EMOJIS = ["🚂💨", "🚃✨", "🚄🌟", "🚅💫", "🚆🎯"];
const MESSAGES = [
  "All aboard the imagination express! 🎭",
  "Next train departing from Platform 9¾ ✨",
  "Conductor taking a tea break ☕",
  "Trains are playing hide and seek 🙈",
  "The rails are having a quiet moment 🤫",
];

type NoTrainsCardProps = {
  fromStation: Station;
  toStation: Station;
};

export default function NoTrainsCard({
  fromStation,
  toStation,
}: NoTrainsCardProps) {
  // Use random selection for emoji and message (initialized once on mount)
  const [randomEmoji] = useState(
    () => EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
  );
  const [randomMessage] = useState(
    () => MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
  );

  return (
    <div
      className="group bg-gradient-to-r from-surface-2 to-surface-3 rounded-xl border border-accent-border/30 shadow-lg overflow-hidden"
      role="alert"
      aria-label={`No trains available between ${fromStation.stationName} and ${toStation.stationName}`}
    >
      <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500"></div>

      <div className="p-6 text-center">
        <div className="text-6xl mb-4">{randomEmoji}</div>

        <div className="text-xl font-medium text-gray-200 mb-2">
          {randomMessage}
        </div>

        <div className="text-muted mb-4">
          No services currently running between{" "}
          <span className="text-accent-strong font-medium">
            {fromStation.stationName}
          </span>{" "}
          and{" "}
          <span className="text-accent-strong font-medium">
            {toStation.stationName}
          </span>
        </div>

        <Link
          target="_blank"
          href={`https://www.realtimetrains.co.uk/search/simple/gb-nr:${fromStation.stationCode}/to/gb-nr:${toStation.stationCode}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600/20 text-accent rounded-lg border border-accent-border/30 hover:bg-cyan-600/30 hover:border-accent-border/50 transition-all duration-200 group-hover:scale-105"
        >
          <span>Check Real Time Trains</span>
          <span className="text-sm">🔍</span>
        </Link>
      </div>
    </div>
  );
}
