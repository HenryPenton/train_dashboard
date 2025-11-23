import React from "react";
import { Place } from "../../types/route";

type RouteEndpointsProps = {
  from: Place;
  to: Place;
};

export default function RouteEndpoints({ from, to }: RouteEndpointsProps) {
  return (
    <div 
      className="flex items-center justify-between mb-4"
      role="region"
      aria-label="Journey route information"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-400/50"></div>
          <span className="text-emerald-300 text-sm font-medium uppercase tracking-wider">
            Departure
          </span>
        </div>
        <span className="text-white font-bold text-lg block ml-7">
          {from.placeName}
        </span>
      </div>

      <div className="flex-1 self-start">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-400 to-pink-500 shadow-lg shadow-red-400/50"></div>
          <span className="text-red-300 text-sm font-medium uppercase tracking-wider">
            Destination
          </span>
        </div>
        <span className="text-white font-bold text-lg block ml-7">
          {to.placeName}
        </span>
      </div>
    </div>
  );
}
