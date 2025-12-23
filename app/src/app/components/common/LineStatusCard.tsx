import {
  getSeverityBorderColor,
  getSeverityStatusBarColor,
} from "../../utils/colorMappings";
import StatusBadge from "./StatusBadge";
import StatusBar from "./StatusBar";

type StatusItem = {
  status: string;
  reason?: string | null;
};

type LineStatusCardProps = {
  name: string;
  statuses: StatusItem[];
  severity: number;
};

export default function LineStatusCard({
  name,
  statuses,
  severity,
}: LineStatusCardProps) {
  return (
    <div className="group">
      <div
        className={`bg-gradient-to-r from-[#2a2d35] to-[#323741] rounded-xl border ${getSeverityBorderColor(severity)}/30 shadow-lg`}
        role="article"
        aria-label={`${name} line status: ${statuses && statuses.length > 0 ? statuses.map((s) => s.status).join(", ") : "Unknown"}`}
      >
        <StatusBar backgroundColor={getSeverityStatusBarColor(severity)} />

        <div className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
            <div
              className="text-lg font-bold text-cyan-200"
              role="heading"
              aria-level={3}
            >
              {name}
            </div>
            <div
              className="flex flex-col text-center gap-2"
              role="list"
              aria-label="Status list"
            >
              {statuses && statuses.length > 0 ? (
                statuses.map((item, index) => (
                  <StatusBadge
                    key={index}
                    status={item.status}
                    severity={severity}
                    reason={item.reason}
                  />
                ))
              ) : (
                <StatusBadge status="Unknown" severity={severity} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
