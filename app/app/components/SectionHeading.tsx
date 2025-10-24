import React from "react";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export default function SectionHeading({
  children,
  className = "",
  ariaLabel,
}: SectionHeadingProps) {
  return (
    <h2
      className={`text-xl font-semibold mb-2 ${className}`}
      role="heading"
      aria-level={2}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
    >
      {children}
    </h2>
  );
}
