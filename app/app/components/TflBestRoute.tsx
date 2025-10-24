"use client";
import { useEffect, useState } from "react";

interface BestRouteData {
  route: string[];
  duration: number;
  arrival: string;
  fare: number | null;
}

type TflRouteProps = {
  from: { placeName: string; naptanOrAtco: string };
  to: { placeName: string; naptanOrAtco: string };
};

export default function TflBestRoute({ from, to }: TflRouteProps) {
  const [data, setData] = useState<BestRouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBestRoute() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/best-route/${from.naptanOrAtco}/${to.naptanOrAtco}`
        );
        if (!res.ok) throw new Error("Failed to fetch best route");
        const json = await res.json();

        setData(json);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchBestRoute();
  }, [from.naptanOrAtco, to.naptanOrAtco]);

  if (loading) return <div className="text-white">Loading best route...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;
  if (!data) return <div className="text-white">No route data available.</div>;

  return (
    <div className="bg-[#23272f] rounded-lg p-6 shadow-lg">
      <h2
        className="text-xl font-semibold text-white mb-2"
        role="heading"
        aria-level={2}
      >
        Best Route
      </h2>
      <div className="text-white mb-1" aria-label="Origin">
        <span className="font-bold">From:</span> {from.placeName}
      </div>
      <div className="text-white mb-1" aria-label="Destination">
        <span className="font-bold">To:</span> {to.placeName}
      </div>
      <div className="text-white mb-1">
        <span className="font-bold">Route:</span>
        <div className="ml-2 mt-1 flex flex-col gap-1">{routeLegs(data)}</div>
      </div>
      <div
        className="text-white mb-1"
        aria-label="Journey duration and arrival"
      >
        <span className="font-bold">Duration:</span> {data.duration} min
        <span className="mx-2">|</span>
        <span className="font-bold">Arrival:</span>{" "}
        {new Date(data.arrival).toLocaleTimeString()}
        {typeof data.fare === "number" && (
          <span>
            <span className="mx-2">|</span>
            <span className="font-bold">Fare:</span> £
            {(data.fare / 100).toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}

function routeLegs(data: BestRouteData) {
  const colorMap: Record<string, string> = {
    tube: "text-yellow-300",
    "elizabeth-line": "text-purple-400",
    bus: "text-red-400",
    walk: "text-green-400",
    overground: "text-orange-400",
    train: "text-blue-400",
  };
  return data.route.map((stage, idx) => {
    const match = stage.match(/^([\w\s-]+):\s*(.*)$/i);
    const method = match ? match[1] : null;
    const rest = match ? match[2] : stage;
    const color = method ? colorMap[method.toLowerCase()] : "text-cyan-300";
    return (
      <div
        key={idx}
        className="pl-2 border-l-2 border-cyan-300 flex items-baseline gap-2"
        aria-label={`Journey leg ${idx + 1}`}
      >
        {method && (
          <span className={`text-lg font-bold ${color}`}>{method}: </span>
        )}
        <span className="text-base">{rest}</span>
      </div>
    );
  });
}
