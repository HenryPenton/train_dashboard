"use client";
import React, { useEffect, useState } from "react";

interface BestRouteData {
  origin: string;
  destination: string;
  route: string[];
  duration: number;
  status: string;
}

export default function TflBestRoute() {
  const [data, setData] = useState<BestRouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBestRoute() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/best-route");
        if (!res.ok) throw new Error("Failed to fetch best route");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchBestRoute();
  }, []);

  if (loading) return <div className="text-white">Loading best route...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;
  if (!data) return <div className="text-white">No route data available.</div>;

  return (
    <div className="bg-[#23272f] rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-2">Best Route</h2>
      <div className="text-white mb-1">
        <span className="font-bold">From:</span> {data.origin}
      </div>
      <div className="text-white mb-1">
        <span className="font-bold">To:</span> {data.destination}
      </div>
      <div className="text-white mb-1">
        <span className="font-bold">Route:</span> {data.route.join(" → ")}
      </div>
      <div className="text-white mb-1">
        <span className="font-bold">Duration:</span> {data.duration} min
      </div>
      <div className="text-white mb-1">
        <span className="font-bold">Status:</span> {data.status}
      </div>
    </div>
  );
}
