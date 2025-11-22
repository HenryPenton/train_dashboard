import React from "react";
import { DepartureStatus } from "../sections/TrainDepartures";

type StatusBarProps = {
  status?: DepartureStatus;
  severity?: number;
};

export default function StatusBar({ status, severity }: StatusBarProps) {
  const getStatusColors = () => {
    // If severity is provided, use severity-based coloring (1-10 scale)
    if (severity !== undefined) {
      const severityColors: { [key: number]: string } = {
        1: "bg-red-900",
        2: "bg-red-800", 
        3: "bg-red-700",
        4: "bg-red-500",
        5: "bg-red-400",
        6: "bg-orange-400",
        7: "bg-orange-500",
        8: "bg-yellow-400",
        9: "bg-yellow-300",
        10: "bg-green-400",
      };
      return severityColors[severity] || "bg-gray-500";
    }
    
    // If status is provided, use departure status coloring
    if (status) {
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
    }
    
    // Default fallback
    return "bg-gray-500";
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
