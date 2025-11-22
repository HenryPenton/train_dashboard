import React from "react";
import { useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import { APP_CONSTANTS } from "../../constants/app";
import { BestRouteData, Place } from "../../types/route";
import SectionHeading from "../common/SectionHeading";
import SectionCard from "../common/SectionCard";
import Loading from "../common/Loading";
import ErrorDisplay from "../common/ErrorDisplay";
import RouteEndpoints from "../common/RouteEndpoints";
import JourneyMetrics from "../common/JourneyMetrics";
import RouteSteps from "../common/RouteSteps";

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

  console.log(data);
  return (
    <SectionCard className="overflow-hidden">
      <div className="relative">
        <div className="relative">
          <SectionHeading className="mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-bold">
              Optimal Route
            </span>
          </SectionHeading>

          <div className="space-y-6">
            {/* Enhanced Journey Header */}
            <div className="relative group">
              <div className="relative p-4 bg-gradient-to-br from-[#2a2d35]/90 via-[#323741]/90 to-[#2a2d35]/90 rounded-2xl border border-cyan-400/30">
                <RouteEndpoints from={from} to={to} />
                <JourneyMetrics
                  duration={data.duration}
                  arrival={data.arrival}
                  fare={data.fare}
                />
              </div>
            </div>

            {/* Enhanced Route Steps */}
            <RouteSteps legs={data.legs} />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
