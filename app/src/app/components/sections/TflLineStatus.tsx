import { APP_CONSTANTS } from "../../constants/app";
import { useFetch } from "../../hooks/useFetch";
import ErrorDisplay from "../common/ErrorDisplay";
import LineStatusCard from "../common/LineStatusCard";
import Loading from "../common/Loading";
import SectionCard from "../common/SectionCard";
import SectionHeading from "../common/SectionHeading";

type StatusItem = {
  status: string;
  reason?: string | null;
};

type TflLineStatusType = {
  name: string;
  statuses: StatusItem[];
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
            statuses={line.statuses}
            severity={line.statusSeverity}
          />
        ))}
      </div>
    </SectionCard>
  );
}
