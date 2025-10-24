"use client";
import { useEffect, useState } from "react";
import SectionHeading from "../../SectionHeading";
import RouteLegs from "./RouteLegs";

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
  <SectionHeading className="text-white">Best Route</SectionHeading>
      <div className="text-white mb-1" aria-label="Origin">
        <span className="font-bold">From:</span> {from.placeName}
      </div>
      <div className="text-white mb-1" aria-label="Destination">
        <span className="font-bold">To:</span> {to.placeName}
      </div>
      <div className="text-white mb-1">
        <span className="font-bold">Route:</span>
        <div className="ml-2 mt-1 flex flex-col gap-1">
          <RouteLegs route={data.route} />
        </div>
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

