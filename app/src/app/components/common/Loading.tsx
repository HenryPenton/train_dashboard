import React from "react";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="text-cyan-300 animate-pulse flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin"></div>
      {message}
    </div>
  );
}
