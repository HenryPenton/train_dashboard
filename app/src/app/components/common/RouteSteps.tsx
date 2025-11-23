import React from "react";
import { RouteLeg } from "../../types/route";
import RouteStep from "./RouteStep";

type RouteStepsProps = {
  legs: RouteLeg[];
};

export default function RouteSteps({ legs }: RouteStepsProps) {
  return (
    <div className="relative group">
      <div
        className="relative p-4 bg-gradient-to-br from-[#2a2d35]/95 via-[#1e2128]/95 to-[#2a2d35]/95 rounded-2xl border border-purple-400/20"
        role="region"
        aria-label="Journey steps breakdown"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg">
              <span className="text-2xl" aria-hidden="true">
                🗺️
              </span>
            </div>
            <h3
              className="text-white font-bold text-lg"
              role="heading"
              aria-level={3}
            >
              Journey Steps
            </h3>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 via-cyan-400/50 to-transparent"></div>
          <div className="px-3 py-1 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full border border-purple-400/30 flex items-center justify-center">
            <span className="text-purple-300 text-xs font-medium text-center">
              {legs.length} steps
            </span>
          </div>
        </div>

        <div
          className="space-y-3"
          role="list"
          aria-label={`Journey with ${legs.length} steps`}
        >
          {legs.map((leg, i) => (
            <RouteStep
              key={i}
              leg={leg}
              stepNumber={i + 1}
              isLast={i === legs.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
