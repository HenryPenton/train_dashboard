import React from "react";
import { DepartureStatus } from "../sections/TrainDepartures";

type StatusBarProps = {
  status: DepartureStatus;
};

export default function StatusBar({ status }: StatusBarProps) {
  const getStatusColors = () => {
    switch (status) {
      case "On time":
        return "bg-green-500";
      case "Early":
        return "bg-blue-500";
      case "Late":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <div className={`h-1 w-full relative overflow-hidden ${getStatusColors()}`}>
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"
        style={{
          animation: "shimmer 3.5s linear infinite",
          backgroundSize: "200% 100%",
        }}
      ></div>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          43% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
