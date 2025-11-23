import React from "react";
import StatusBar from "./StatusBar";
import StatusBadge from "./StatusBadge";
import {
  getSeverityStatusBarColor,
  getSeverityBorderColor,
} from "../../utils/colorMappings";

type LineStatusCardProps = {
  name: string;
  statusList: string[];
  severity: number;
};

export default function LineStatusCard({
  name,
  statusList,
  severity,
}: LineStatusCardProps) {
  return (
    <div className="group">
      <div
        className={`bg-gradient-to-r from-[#2a2d35] to-[#323741] rounded-xl border ${getSeverityBorderColor(severity)}/30 shadow-lg overflow-hidden`}
      >
        <StatusBar backgroundColor={getSeverityStatusBarColor(severity)} />

        <div className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
            <div className="text-lg font-bold text-cyan-200">{name}</div>
            <div className="flex flex-col text-center gap-2">
              {statusList && statusList.length > 0 ? (
                statusList.map((status, index) => (
                  <StatusBadge
                    key={index}
                    status={status}
                    severity={severity}
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
