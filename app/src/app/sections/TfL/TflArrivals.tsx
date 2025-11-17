import { useEffect, useState } from "react";
import SectionHeading from "../../components/text/SectionHeading";

type ArrivalType = {
  id: string;
  lineId: string;
  lineName: string;
  platformName: string;
  timeToStation: number;
  expectedArrival: string;
  towards: string;
  currentLocation?: string;
  destinationName?: string;
  direction?: string;
};

type LineArrivalsType = {
  lineName: string;
  arrivals: Record<string, ArrivalType[]>;
};

type StationArrivalsType = {
  lines: Record<string, LineArrivalsType>;
};

interface TflArrivalsProps {
  stationId: string;
  stationName: string;
}

export default function TflArrivals({
  stationId,
  stationName,
}: TflArrivalsProps) {
  const [arrivals, setArrivals] = useState<StationArrivalsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArrivals = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/arrivals/${stationId}`);
        if (!res.ok) throw new Error(`Failed to fetch arrivals`);

        const data = await res.json();
        setArrivals(data);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchArrivals();
  }, [stationId]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return minutes < 1 ? "Due" : `${minutes}m`;
  };

  return (
    <section
      className="bg-[#23262f] rounded-[12px] p-6 text-[#f1f1f1] shadow-[0_2px_12px_0_rgba(0,0,0,0.25)]"
      aria-label="TFL Arrivals Section"
      role="region"
    >
      <SectionHeading className="text-white" ariaLabel="TFL Arrivals Heading">
        {stationName} Arrivals
      </SectionHeading>

      {loading && (
        <div role="status" aria-label="Loading arrivals">
          Loading arrivals...
        </div>
      )}

      {error && (
        <div
          className="text-[#ff4d4f] bg-[#2a1a1a] p-2 rounded mb-2"
          role="alert"
          aria-label="Arrivals error"
        >
          {error}
        </div>
      )}

      {arrivals && (
        <div className="space-y-4">
          {Object.entries(arrivals.lines).map(([lineId, lineData]) => (
            <div
              key={lineId}
              className="border-b border-gray-600 pb-4 last:border-b-0"
            >
              <h3 className="text-lg font-bold text-cyan-300 mb-2">
                {lineData.lineName}
              </h3>
              {Object.entries(lineData.arrivals).map(
                ([platform, platformArrivals]) => (
                  <div key={platform} className="mb-3">
                    <h4 className="text-sm font-semibold text-yellow-300 mb-1">
                      {platform}
                    </h4>
                    <div className="space-y-1">
                      {platformArrivals.slice(0, 3).map((arrival) => (
                        <div
                          key={arrival.id}
                          className="flex justify-between items-center text-sm bg-[#1a1d24] p-2 rounded"
                        >
                          <span className="text-white">{arrival.towards}</span>
                          <span className="text-green-400 font-mono">
                            {formatTime(arrival.timeToStation)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
