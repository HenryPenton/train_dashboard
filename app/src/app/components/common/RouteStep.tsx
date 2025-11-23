import React from "react";
import { RouteLeg } from "../../types/route";

type RouteStepProps = {
  leg: RouteLeg;
  stepNumber: number;
  isLast: boolean;
};

export default function RouteStep({ leg, stepNumber, isLast }: RouteStepProps) {
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
    <>
      <div 
        className="relative group/step"
        role="listitem"
        aria-label={`Step ${stepNumber}: ${leg.mode.replace("-", " ")} from ${leg.departure} to ${leg.arrival}`}
      >
        <div
          className={`relative p-3 bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border}`}
        >
          {/* Step Header */}
          <div className="flex items-center mb-2">
            {/* Enhanced Step Number */}
            <div className="flex-shrink-0 relative mr-5">
              <div 
                className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center text-gray-800 font-bold text-sm shadow-lg relative z-10"
                aria-label={`Step ${stepNumber}`}
              >
                {stepNumber}
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
                  {leg.line &&
                    leg.mode.toLowerCase() !== "elizabeth-line" &&
                    leg.mode.toLowerCase() !== "tram" && (
                      <div className="text-gray-300 text-sm font-medium px-2 py-1 bg-black/20 rounded-md w-fit">
                        {leg.line}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Route Bar */}
          <div className="w-full bg-black/30 rounded-lg p-2 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-start">
                <div className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                  From
                </div>
                <div 
                  className="text-white font-bold text-sm"
                  aria-label={`Departure station: ${leg.departure}`}
                >
                  {leg.departure}
                </div>
              </div>

              <div className="flex flex-col items-start">
                <div className="text-red-300 text-xs font-bold uppercase tracking-wider mb-1">
                  To
                </div>
                <div 
                  className="text-white font-bold text-sm"
                  aria-label={`Arrival station: ${leg.arrival}`}
                >
                  {leg.arrival}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Connection Line */}
      {!isLast && (
        <div className="flex justify-center py-1">
          <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 via-purple-400 to-cyan-400 rounded-full animate-pulse"></div>
        </div>
      )}
    </>
  );
}
