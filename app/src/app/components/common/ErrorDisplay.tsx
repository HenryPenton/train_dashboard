import React from "react";

interface ErrorDisplayProps {
  message: string;
  className?: string;
}

export default function ErrorDisplay({
  message,
  className = "",
}: ErrorDisplayProps) {
  return (
    <div
      className={`text-red-400 p-4 border border-red-600 rounded bg-red-900/20 ${className}`}
      role="alert"
      aria-label={`Error message: ${message}`}
    >
      <span className="mr-2" aria-hidden="true">⚠️</span>
      Error: {message}
    </div>
  );
}
