import React from "react";
import { useFetch } from "../../hooks/useFetch";
import { APP_CONSTANTS } from "../../constants/app";
import SectionHeading from "../common/SectionHeading";
import SectionCard from "../common/SectionCard";
import Loading from "../common/Loading";
import ErrorDisplay from "../common/ErrorDisplay";

type TflLineStatusType = {
  name: string;
  status: string;
  statusSeverity: number;
  reason?: string;
};

export default function TflLineStatus() {
  const { data: lineStatuses, loading, error } = useFetch<TflLineStatusType[]>(
    APP_CONSTANTS.API_ENDPOINTS.LINE_STATUS
  );

  if (loading) return <Loading message="Loading line status..." />;
  if (error) return <ErrorDisplay message={error} />;
  if (!lineStatuses || lineStatuses.length === 0) 
    return <ErrorDisplay message="No line status data available" />;

  const getStatusColor = (severity: number) => {
    if (severity >= 10) return "text-green-400"; // Good service
    if (severity >= 8) return "text-yellow-400"; // Minor delays
    if (severity >= 5) return "text-orange-400"; // Severe delays
    return "text-red-400"; // Suspended/Part suspended
  };

  const getBorderColor = (severity: number) => {
    if (severity >= 10) return "border-green-500";
    if (severity >= 8) return "border-yellow-500";
    if (severity >= 5) return "border-orange-500";
    return "border-red-500";
  };

  return (
    <SectionCard>
      <SectionHeading>
        🚇 TfL Line Status
      </SectionHeading>
      
      <div className="space-y-2">
        {lineStatuses.map((line, i) => (
          <div key={i} className={`flex justify-between items-center p-3 bg-[#2a2d35] rounded border-l-4 ${getBorderColor(line.statusSeverity)}`}>
            <div className="flex flex-col">
              <div className="text-lg font-bold text-cyan-200">
                {line.name}
              </div>
              {line.reason && (
                <div className="text-sm text-gray-400">
                  {line.reason}
                </div>
              )}
            </div>
            <div className={`text-sm font-semibold ${getStatusColor(line.statusSeverity)}`}>
              {line.status}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}