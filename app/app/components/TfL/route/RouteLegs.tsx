import React from "react";

interface RouteLegsProps {
  route: string[];
}

const colorMap: Record<string, string> = {
  tube: "text-yellow-300",
  "elizabeth-line": "text-purple-400",
  bus: "text-red-400",
  walk: "text-green-400",
  overground: "text-orange-400",
  train: "text-blue-400",
};

export default function RouteLegs({ route }: RouteLegsProps) {
  return (
    <>
      {route.map((stage, idx) => {
        const match = stage.match(/^([\w\s-]+):\s*(.*)$/i);
        const method = match ? match[1] : null;
        const rest = match ? match[2] : stage;
        const color = method ? colorMap[method.toLowerCase()] : "text-cyan-300";
        return (
          <div
            key={idx}
            className="pl-2 border-l-2 border-cyan-300 flex items-baseline gap-2"
            aria-label={`Journey leg ${idx + 1}`}
          >
            {method && (
              <span className={`text-lg font-bold ${color}`}>{method}: </span>
            )}
            <span className="text-base">{rest}</span>
          </div>
        );
      })}
    </>
  );
}
