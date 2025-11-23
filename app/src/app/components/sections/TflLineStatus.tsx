import React from "react";
import { useFetch } from "../../hooks/useFetch";
import { APP_CONSTANTS } from "../../constants/app";
import SectionHeading from "../common/SectionHeading";
import SectionCard from "../common/SectionCard";
import Loading from "../common/Loading";
import ErrorDisplay from "../common/ErrorDisplay";
import LineStatusCard from "../common/LineStatusCard";

type TflLineStatusType = {
  name: string;
  statusList: string[];
  statusSeverity: number;
};

export default function TflLineStatus() {
  const {
    data: lineStatuses,
    loading,
    error,
  } = useFetch<TflLineStatusType[]>(APP_CONSTANTS.API_ENDPOINTS.LINE_STATUS);

  if (loading) return <Loading message="Loading line status..." />;
  if (error) return <ErrorDisplay message={error} />;
  if (!lineStatuses || lineStatuses.length === 0)
    return <ErrorDisplay message="No line status data available" />;

  return (
    <SectionCard>
      <SectionHeading fancy>TfL Line Status</SectionHeading>

      <div className="space-y-3">
        {lineStatuses.map((line, i) => (
          <LineStatusCard
            key={i}
            name={line.name}
            statusList={line.statusList}
            severity={line.statusSeverity}
          />
        ))}
      </div>
    </SectionCard>
  );
}
