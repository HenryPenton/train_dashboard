import React from "react";

type DelayInfoProps = {
  delay: number;
};

export default function DelayInfo({ delay }: DelayInfoProps) {
  const getDelayColor = () => {
    if (delay > 0) return "text-red-400";
    if (delay === 0) return "text-green-400";
    return "text-gray-300";
  };

  return (
    <div
      className="text-sm"
      role="status"
      aria-label={`Train delay information: ${delay === 0 ? "On time" : `${delay} minutes delayed`}`}
    >
      <span className="text-gray-400">Delay: </span>
      <span className={`font-semibold ${getDelayColor()}`}>
        {delay === 0 ? "On time" : `${delay} min`}
      </span>
    </div>
  );
}
