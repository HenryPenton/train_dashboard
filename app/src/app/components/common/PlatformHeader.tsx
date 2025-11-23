import React from "react";

type PlatformHeaderProps = {
  platformName: string;
};

export default function PlatformHeader({ platformName }: PlatformHeaderProps) {
  return (
    <div
      className="text-sm font-semibold text-yellow-300 px-2"
      role="heading"
      aria-level={3}
      aria-label={`Platform section: ${platformName}`}
    >
      {platformName}
    </div>
  );
}
