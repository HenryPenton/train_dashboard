import React from "react";

export default function DepartureError({ message }: { message: string }) {
  return (
    <div
      className="text-[#ff4d4f] bg-[#2a1a1a] p-2 rounded mb-2"
      role="alert"
      aria-label="Departure error"
    >
      {message}
    </div>
  );
}
