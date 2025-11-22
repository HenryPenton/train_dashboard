import React from "react";
import { useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import { APP_CONSTANTS } from "../../constants/app";
import SectionHeading from "../common/SectionHeading";
import SectionCard from "../common/SectionCard";
import Loading from "../common/Loading";
import ErrorDisplay from "../common/ErrorDisplay";

interface BestRouteData {
  duration: number;
  arrival: string;
  legs: Array<{
    mode: string;
    instruction: string;
    departure: string;
    arrival: string;
    line: string;
  }>;
  fare?: number;
}

interface Place {
  placeName: string;
  naptanOrAtco: string;
}

type TflBestRouteProps = {
  from: Place;
  to: Place;
};

export default function TflBestRoute({ from, to }: TflBestRouteProps) {
  const url = useMemo(
    () =>
      APP_CONSTANTS.API_ENDPOINTS.BEST_ROUTE(
        from.naptanOrAtco,
        to.naptanOrAtco,
      ),
    [from.naptanOrAtco, to.naptanOrAtco],
  );

  const { data, loading, error } = useFetch<BestRouteData>(url);

  if (loading) return <Loading message="Finding your perfect route..." />;
  if (error) return <ErrorDisplay message={error} />;
  if (!data) return <ErrorDisplay message="No route data available" />;

  const formatArrivalTime = (arrival: string) => {
    return new Date(arrival).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getDurationColor = (duration: number) => {
    if (duration <= 30) return "text-emerald-400";
    if (duration <= 60) return "text-yellow-400";
    return "text-orange-400";
  };
  console.log(data);
  return (
    <SectionCard className="overflow-hidden">
      <div className="relative">
        <div className="relative">
          <SectionHeading className="mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-bold">
              Optimal Route
            </span>
          </SectionHeading>

          <div className="space-y-8">
            {/* Enhanced Journey Header */}
            <div className="relative group">
              <div className="relative p-6 bg-gradient-to-br from-[#2a2d35]/90 via-[#323741]/90 to-[#2a2d35]/90 rounded-2xl border border-cyan-400/30">
                {/* Route Endpoints */}
                <div className="flex items-center justify-between mb-6">
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

                  <div className="flex-shrink-0 mx-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-400/30">
                      <span className="text-2xl animate-pulse">✨</span>
                      <span className="text-cyan-300 font-semibold text-sm">
                        BEST
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-3 mb-2">
                      <span className="text-red-300 text-sm font-medium uppercase tracking-wider">
                        Destination
                      </span>
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-400 to-pink-500 shadow-lg shadow-red-400/50"></div>
                    </div>
                    <span className="text-white font-bold text-lg block mr-7">
                      {to.placeName}
                    </span>
                  </div>
                </div>

                {/* Journey Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="group/metric">
                    <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-400/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-400/20 rounded-lg">
                          <span className="text-xl">⚡</span>
                        </div>
                        <div>
                          <div className="text-emerald-300 text-xs font-medium uppercase tracking-wider">
                            Duration
                          </div>
                          <div
                            className={`font-bold text-xl ${getDurationColor(data.duration)}`}
                          >
                            {data.duration} <span className="text-sm">min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group/metric">
                    <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-400/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-400/20 rounded-lg">
                          <span className="text-xl">🎯</span>
                        </div>
                        <div>
                          <div className="text-cyan-300 text-xs font-medium uppercase tracking-wider">
                            Arrives
                          </div>
                          <div className="text-white font-bold text-xl">
                            {formatArrivalTime(data.arrival)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {data.fare && typeof data.fare === "number" && (
                    <div className="group/metric">
                      <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-400/20">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-400/20 rounded-lg">
                            <span className="text-xl">💰</span>
                          </div>
                          <div>
                            <div className="text-yellow-300 text-xs font-medium uppercase tracking-wider">
                              Fare
                            </div>
                            <div className="text-white font-bold text-xl">
                              £{(data.fare / 100).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Route Steps */}
            <div className="relative group">
              <div className="relative p-6 bg-gradient-to-br from-[#2a2d35]/95 via-[#1e2128]/95 to-[#2a2d35]/95 rounded-2xl border border-purple-400/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg">
                      <span className="text-2xl">🗺️</span>
                    </div>
                    <span className="text-white font-bold text-lg">
                      Journey Steps
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 via-cyan-400/50 to-transparent"></div>
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full border border-purple-400/30">
                    <span className="text-purple-300 text-xs font-medium">
                      {data.legs.length} steps
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.legs.map((leg, i) => {
                    const getModeColors = (mode: string) => {
                      const modeColorSchemes: Record<
                        string,
                        {
                          text: string;
                          bg: string;
                          border: string;
                          glow: string;
                        }
                      > = {
                        tube: {
                          text: "text-yellow-300",
                          bg: "from-yellow-500/20 to-orange-500/20",
                          border: "border-yellow-400/30",
                          glow: "shadow-yellow-400/20",
                        },
                        bus: {
                          text: "text-red-300",
                          bg: "from-red-500/20 to-pink-500/20",
                          border: "border-red-400/30",
                          glow: "shadow-red-400/20",
                        },
                        walking: {
                          text: "text-green-300",
                          bg: "from-green-500/20 to-emerald-500/20",
                          border: "border-green-400/30",
                          glow: "shadow-green-400/20",
                        },
                        train: {
                          text: "text-blue-300",
                          bg: "from-blue-500/20 to-indigo-500/20",
                          border: "border-blue-400/30",
                          glow: "shadow-blue-400/20",
                        },
                        overground: {
                          text: "text-orange-300",
                          bg: "from-orange-500/20 to-red-500/20",
                          border: "border-orange-400/30",
                          glow: "shadow-orange-400/20",
                        },
                        "elizabeth-line": {
                          text: "text-purple-300",
                          bg: "from-purple-500/20 to-pink-500/20",
                          border: "border-purple-400/30",
                          glow: "shadow-purple-400/20",
                        },
                        tram: {
                          text: "text-lime-300",
                          bg: "from-lime-500/20 to-green-500/20",
                          border: "border-lime-400/30",
                          glow: "shadow-lime-400/20",
                        },
                        "national-rail": {
                          text: "text-indigo-300",
                          bg: "from-indigo-500/20 to-blue-500/20",
                          border: "border-indigo-400/30",
                          glow: "shadow-indigo-400/20",
                        },
                      };
                      return (
                        modeColorSchemes[mode.toLowerCase()] || {
                          text: "text-cyan-300",
                          bg: "from-cyan-500/20 to-blue-500/20",
                          border: "border-cyan-400/30",
                          glow: "shadow-cyan-400/20",
                        }
                      );
                    };

                    const colors = getModeColors(leg.mode);

                    return (
                      <div key={i} className="relative group/step">
                        <div
                          className={`relative p-4 bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border}`}
                        >
                          {/* Step Header */}
                          <div className="flex items-center mb-3">
                            {/* Enhanced Step Number */}
                            <div className="flex-shrink-0 relative mr-5">
                              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center text-gray-800 font-bold text-sm shadow-lg relative z-10">
                                {i + 1}
                              </div>
                            </div>

                            {/* Enhanced Mode Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`font-bold text-base ${colors.text} capitalize tracking-wide`}
                                  >
                                    {leg.mode.replace("-", " ")}
                                  </span>
                                  {leg.line && leg.mode.toLowerCase() !== 'elizabeth-line' && leg.mode.toLowerCase() !== 'tram' && (
                                    <div className="text-gray-300 text-sm font-medium px-2 py-1 bg-black/20 rounded-md w-fit">
                                      {leg.line}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Route Bar */}
                          <div className="w-full bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col items-start">
                                <div className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                                  From
                                </div>
                                <div className="text-white font-bold text-sm">
                                  {leg.departure}
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-start">
                                <div className="text-red-300 text-xs font-bold uppercase tracking-wider mb-1">
                                  To
                                </div>
                                <div className="text-white font-bold text-sm">
                                  {leg.arrival}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Connection Line */}
                        {i < data.legs.length - 1 && (
                          <div className="flex justify-center py-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 via-purple-400 to-cyan-400 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
