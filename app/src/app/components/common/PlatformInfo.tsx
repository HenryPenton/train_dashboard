import React from "react";

type PlatformInfoProps = {
  platform: string;
};

export default function PlatformInfo({ platform }: PlatformInfoProps) {
  return (
    <div className="text-sm" aria-label={`Departing from platform ${platform}`}>
      <span className="text-gray-400">Platform: </span>
      <span className="text-gray-300 font-semibold">{platform}</span>
    </div>
  );
}
