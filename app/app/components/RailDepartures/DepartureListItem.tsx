import Link from "next/link";
import { Departure } from "../../sections/rail/TrainDepartures";

function renderDepartureStatus(dep: Departure) {
  return (
    <span
      aria-label={`${dep.status} departure`}
      className={`font-semibold ${dep.status === "Late" ? "text-[#ff4d4f]" : "text-[#4ade80]"}`}
    >
      {dep.actual}
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
        Departs: {renderDepartureStatus(dep)} {" | Platform: "}
        {dep.platform || "-"}
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
      </span>
    </li>
  );
}
