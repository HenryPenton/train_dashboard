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
    >
      <span className="mr-2">⚠️</span>
      Error: {message}
    </div>
  );
}
