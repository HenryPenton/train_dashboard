import React from "react";

type StatusBarProps = {
  backgroundColor: string;
};

export default function StatusBar({ backgroundColor }: StatusBarProps) {
  return (
    <div
      className={`h-1 w-full relative overflow-hidden ${backgroundColor}`}
      role="status"
      aria-label="Status indicator"
      aria-live="polite"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"
        style={{
          animation: "shimmer 3.5s linear infinite",
          backgroundSize: "200% 100%",
        }}
      ></div>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          43% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
