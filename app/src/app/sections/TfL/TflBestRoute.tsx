"use client";
import { useMemo } from "react";
import { BestRouteSchema } from "../../validators/frontend-validators/BestRouteSchema";
import { APP_CONSTANTS } from "../../constants/app";
import { useFetch } from "../../hooks/useFetch";
import SectionHeading from "../../components/text/SectionHeading";
import JourneyInfo from "../../components/TfL/JourneyInfo";
import RouteLegs from "../../components/TfL/RouteLegs";

interface BestRouteData {
  route: string[];
  duration: number;
  arrival: string;
  fare?: number;
}

interface Place {
  placeName: string;
  naptanOrAtco: string;
}

type TflRouteProps = {
  from: Place;
  to: Place;
};

export default function TflBestRoute({ from, to }: TflRouteProps) {
  const url = useMemo(
    () =>
      APP_CONSTANTS.API_ENDPOINTS.BEST_ROUTE(
        from.naptanOrAtco,
        to.naptanOrAtco,
      ),
    [from.naptanOrAtco, to.naptanOrAtco],
  );

  const { data: rawData, loading, error } = useFetch<BestRouteData>(url);

  const data = useMemo(() => {
    if (!rawData) return null;
    return BestRouteSchema.parse(rawData);
  }, [rawData]);

  if (loading) return <div className="text-white">Loading best route...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;
  if (!data) return <div className="text-white">No route data available.</div>;

  return (
    <div className="bg-[#23272f] rounded-lg p-6 shadow-lg">
      <SectionHeading className="text-white">Best Route</SectionHeading>
      <JourneyInfo
        from={from.placeName}
        to={to.placeName}
        duration={data.duration}
        arrival={data.arrival}
        fare={data.fare}
      />
      <div className="text-white mb-1">
        <span className="font-bold">Route:</span>
        <div className="ml-2 mt-1 flex flex-col gap-1">
          <RouteLegs route={data.route} />
        </div>
      </div>
    </div>
  );
}
