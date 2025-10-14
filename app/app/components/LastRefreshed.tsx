import { useMemo } from "react";

export default function LastRefreshed() {
  // Memoize the time so it doesn't change on re-render
  const lastRefreshed = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, []);

  return (
    <div className="mt-10 text-center text-[#b0b0b0] text-sm">
      Last refreshed: {lastRefreshed}
    </div>
  );
}
