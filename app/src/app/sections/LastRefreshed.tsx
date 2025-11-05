import { useMemo } from "react";

export default function LastRefreshed({
  dateTimeString,
}: {
  dateTimeString: string;
}) {
  const lastRefreshed = useMemo(() => {
    const now = new Date(dateTimeString);
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, [dateTimeString]);

  return (
    <div className="mt-10 text-center text-[#b0b0b0] text-sm">
      Last refreshed: {lastRefreshed}
    </div>
  );
}
