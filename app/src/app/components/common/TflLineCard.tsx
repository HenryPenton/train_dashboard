import React from "react";
import StatusBar from "./StatusBar";

type TflLineCardProps = {
  lineName: string;
  children: React.ReactNode;
};

export default function TflLineCard({ lineName, children }: TflLineCardProps) {
  return (
    <div className="group">
      <div 
        className="bg-gradient-to-r from-[#2a2d35] to-[#323741] rounded-xl border border-cyan-500/30 shadow-lg overflow-hidden"
        role="region"
        aria-labelledby={`line-${lineName.replace(/\s+/g, '-').toLowerCase()}-heading`}
      >
        <StatusBar backgroundColor="bg-gradient-to-r from-cyan-400 to-blue-400" />

        <div className="p-4">
          <h2 
            className="text-lg font-bold text-cyan-200 mb-4"
            id={`line-${lineName.replace(/\s+/g, '-').toLowerCase()}-heading`}
          >
            {lineName}
          </h2>

          <ul className="space-y-3" role="list" aria-label={`${lineName} arrivals`}>
            {children}
          </ul>
        </div>
      </div>
    </div>
  );
}
