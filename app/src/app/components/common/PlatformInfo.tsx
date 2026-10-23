import React from "react";

type PlatformInfoProps = {
  platform: string;
};

export default function PlatformInfo({ platform }: PlatformInfoProps) {
  return (
    <div className="text-sm" aria-label={`Departing from platform ${platform}`}>
      <span className="text-muted">Platform: </span>
      <span className="text-fg-soft font-semibold">{platform}</span>
    </div>
  );
}
