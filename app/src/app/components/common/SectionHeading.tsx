import React from "react";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  id?: string;
  /** When true, renders the heading text with the gradient + bold styling used by the Best Route title */
  fancy?: boolean;
}

export default function SectionHeading({
  children,
  className = "",
  ariaLabel,
  id,
  fancy = false,
}: SectionHeadingProps) {
  return (
    <h2
      className={`text-xl font-semibold mb-4 text-cyan-300 border-b border-cyan-600 pb-2 ${className}`}
      role="heading"
      aria-level={2}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      {...(id ? { id } : {})}
    >
      {fancy ? (
        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-bold">
          {children}
        </span>
      ) : (
        children
      )}
    </h2>
  );
}
