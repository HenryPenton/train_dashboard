import React from "react";
import StatusBar from "./StatusBar";
import StatusBadge from "./StatusBadge";

type LineStatusCardProps = {
  name: string;
  status: string;
  severity: number;
};

export default function LineStatusCard({ name, status, severity }: LineStatusCardProps) {
  const getBorderColor = (severity: number): string => {
    const borderColors: { [key: number]: string } = {
      1: "border-red-900",
      2: "border-red-800",
      3: "border-red-700",
      4: "border-red-500",
      5: "border-red-400",
      6: "border-orange-400",
      7: "border-orange-500",
      8: "border-yellow-400",
      9: "border-yellow-300",
      10: "border-green-400",
    };
    return borderColors[severity] || "border-gray-500";
  };

  return (
    <div className="group">
      <div className={`bg-gradient-to-r from-[#2a2d35] to-[#323741] rounded-xl border ${getBorderColor(severity)}/30 shadow-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl`}>
        <StatusBar severity={severity} />
        
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold text-cyan-200">
              {name}
            </div>
            <StatusBadge status={status} severity={severity} />
          </div>
        </div>
      </div>
    </div>
  );
}
