import Link from "next/link";
import { Departure } from "../../sections/rail/TrainDepartures";

function renderDepartureStatus(dep: Departure) {
  const getStatusColor = () => {
    if (dep.status === "Cancelled") return "text-[#ff6b6b] line-through";
    if (dep.status === "Late") return "text-[#ff4d4f]";
    return "text-[#4ade80]";
  };

  return (
    <span
      aria-label={`${dep.status} departure`}
      className={`font-semibold ${getStatusColor()}`}
    >
      {dep.status === "Cancelled" ? "CANCELLED" : dep.actual}
    </span>
  );
}

export default function DepartureListItem({ dep }: { dep: Departure }) {
  return (
    <li
      className="mb-4 text-[1.08rem] bg-[#23262f] rounded-[8px] p-[12px_0] shadow-[0_1px_4px_0_rgba(0,0,0,0.13)]"
      role="listitem"
      aria-label={`Departure from ${dep.origin} to ${dep.destination}`}
    >
      <Link target="_blank" href={dep.url}>
        <strong>{dep.origin}</strong> → <strong>{dep.destination}</strong>
      </Link>
      <br />
      <span aria-label="Departure details">
        Departs: {renderDepartureStatus(dep)}
        {dep.status !== "Cancelled" && (
          <>
            {" | Platform: "}
            {dep.platform}
            {typeof dep.delay === "number" && (
              <>
                {" | Delay: "}
                <span
                  className={
                    dep.delay > 0
                      ? "text-[#ff4d4f] font-semibold"
                      : "text-[#4ade80] font-semibold"
                  }
                  aria-label={`Delay: ${dep.delay === 0 ? "On time" : `${dep.delay} min`}`}
                >
                  {dep.delay === 0 ? "On time" : `${dep.delay} min`}
                </span>
              </>
            )}
          </>
        )}
      </span>
    </li>
  );
}
