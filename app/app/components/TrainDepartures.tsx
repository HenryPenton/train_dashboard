import { useEffect, useState } from "react";
import { FrontEndRailDeparturesSchema } from "../validators/frontend-validators/RailDepartureSchema";

type Departure = {
  origin: string;
  destination: string;
  actual: string;
  platform: string;
  delay: number;
  status: "Early" | "On time" | "Late";
};

type TrainDepartureProps = {
  fromStation: { stationName: string; stationCode: string };
  toStation: { stationName: string; stationCode: string };
};

export default function TrainDepartures(props: TrainDepartureProps) {
  const [departures, setDepartures] = useState<Departure[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDepartures = async () => {
      setLoading(true);
      setError(false);
      setDepartures(null);
      try {
        const result = await fetch(
          `/api/departures/${props.fromStation.stationCode}/to/${props.toStation.stationCode}`
        );
        const data = await result.json();

        const departures = FrontEndRailDeparturesSchema.parse(data);

        const tenTrains = departures.slice(0, 10);
        setDepartures(tenTrains);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartures();
  }, [props.fromStation.stationCode, props.toStation.stationCode]);

  return (
    <section
      className="flex-1 bg-[#23262f] rounded-[12px] p-6 text-[#f1f1f1] shadow-[0_2px_12px_0_rgba(0,0,0,0.25)]"
      aria-label="Train Departures Section"
    >
      <h2
        className="text-xl font-semibold text-white mb-2"
        role="heading"
        aria-level={2}
      >
        Train Departures
      </h2>
      <div style={{ marginBottom: 16 }}>
        <span aria-label="Departure route">
          Departures from{" "}
          <strong>
            {props.fromStation.stationName} to{" "}
            {`${props.toStation.stationName}`}
          </strong>
        </span>
        {loading && (
          <span style={{ marginLeft: 8 }} aria-live="polite">
            Loading...
          </span>
        )}
      </div>
      {error && (
        <div
          className="text-[#ff4d4f] bg-[#2a1a1a] p-2 rounded mb-2"
          role="alert"
          aria-label="Departure error"
        >
          Could not find any services for the configured route.
        </div>
      )}
      {departures && (
        <div>
          {departures.length === 0 ? (
            <div role="status" aria-label="No departures found">
              No departures found for this destination.
            </div>
          ) : (
            <ul role="list" aria-label="Departure list">
              {departures.map((dep, i) => (
                <li
                  key={i}
                  className="mb-4 text-[1.08rem] bg-[#23262f] rounded-[8px] p-[12px_0] shadow-[0_1px_4px_0_rgba(0,0,0,0.13)]"
                  role="listitem"
                  aria-label={`Departure from ${dep.origin} to ${dep.destination}`}
                >
                  <strong>{dep.origin}</strong> →{" "}
                  <strong>{dep.destination}</strong>
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
                          aria-label={`Delay: ${
                            dep.delay === 0 ? "On time" : `${dep.delay} min`
                          }`}
                        >
                          {dep.delay === 0 ? "On time" : `${dep.delay} min`}
                        </span>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
function renderDepartureStatus(dep: Departure) {
  return (
    <span
      aria-label={`${dep.status} departure`}
      className={`font-semibold ${
        dep.status === "Late" ? "text-[#ff4d4f]" : "text-[#4ade80]"
      }`}
    >
      {dep.actual}
    </span>
  );
}
