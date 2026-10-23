import React from "react";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div
      className={`bg-surface rounded-[12px] p-6 text-fg shadow-[0_2px_12px_0_rgba(0,0,0,0.25)] ${className}`}
      role="region"
    >
      {children}
    </div>
  );
}
