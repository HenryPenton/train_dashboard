import React from "react";

type JourneyMetricsProps = {
  duration: number;
  arrival: string;
  fare?: number;
};

export default function JourneyMetrics({ duration, arrival, fare }: JourneyMetricsProps) {
  const formatArrivalTime = (arrival: string) => {
    return new Date(arrival).toLocaleTimeString([], {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="group/metric">
        <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-400/20">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-emerald-300 text-xs font-medium uppercase tracking-wider">
                Duration
              </div>
              <div
                className={`font-bold text-xl ${getDurationColor(duration)}`}
              >
                {duration} <span className="text-sm">min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="group/metric">
        <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-400/20">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-cyan-300 text-xs font-medium uppercase tracking-wider">
                Arrival
              </div>
              <div className="text-white font-bold text-xl">
                {formatArrivalTime(arrival)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {fare && typeof fare === "number" && (
        <div className="group/metric">
          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-400/20">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-yellow-300 text-xs font-medium uppercase tracking-wider">
                  Fare
                </div>
                <div className="text-white font-bold text-xl">
                  £{(fare / 100).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
