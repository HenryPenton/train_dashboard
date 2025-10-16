import { useEffect, useState } from "react";

type Departure = {
  origin: string;
  destination: string;
  scheduled: string | null;
  actual: string | null;
  platform: string | null;
  delay: number | null;
};

type TrainDepartureProps = {
  fromStation: { stationName: string; stationCode: string };
  toStation?: { stationName: string; tiploc: string };
};

export default function TrainDepartures(props: TrainDepartureProps) {
  const { toStation } = props;
  const [departures, setDepartures] = useState<Departure[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartures = async () => {
      setLoading(true);
      setError("");
      setDepartures(null);
      try {
        const hasTiploc = toStation && toStation.tiploc;
        let res;
        if (hasTiploc) {
          res = await fetch(
            `/api/departures/${props.fromStation.stationCode}/${toStation.tiploc}`
          );
        } else {
          res = await fetch(`/api/departures/${props.fromStation.stationCode}`);
        }
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        const tenTrains = data.slice(0, 10);
        setDepartures(tenTrains);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";

        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartures();
  }, [props.fromStation.stationCode, toStation]);

  return (
    <section className="flex-1 bg-[#23262f] rounded-[12px] p-6 text-[#f1f1f1] shadow-[0_2px_12px_0_rgba(0,0,0,0.25)]">
      <h2 className="text-xl font-semibold text-white mb-2">
        Train Departures
      </h2>
      <div style={{ marginBottom: 16 }}>
        <span>
          Departures from <strong>{props.fromStation.stationName}</strong>
          <strong>{toStation && ` to ${toStation.stationName}`}</strong>
        </span>
        {loading && <span style={{ marginLeft: 8 }}>Loading...</span>}
      </div>
      {error && (
        <div className="text-[#ff4d4f] bg-[#2a1a1a] p-2 rounded mb-2">
          {error}
        </div>
      )}
      {departures && (
        <div>
          {departures.length === 0 ? (
            <div>No departures found for this destination.</div>
          ) : (
            <ul>
              {departures.map((dep, i) => (
                <li
                  key={i}
                  className="mb-4 text-[1.08rem] bg-[#23262f] rounded-[8px] p-[12px_0] shadow-[0_1px_4px_0_rgba(0,0,0,0.13)]"
                >
                  <strong>{dep.origin}</strong> →{" "}
                  <strong>{dep.destination}</strong>
                  <br />
                  <span>
                    Departs:{" "}
                    {(() => {
                      if (!dep.actual) return dep.scheduled || "-";
                      if (dep.actual !== dep.scheduled) {
                        return (
                          <span className="text-[#ff4d4f] font-semibold">
                            {dep.actual}
                          </span>
                        );
                      }
                      return dep.scheduled || "-";
                    })()}{" "}
                    {" | Platform: "}
                    {dep.platform || "-"}
                    {typeof dep.delay === "number" && (
                      <>
                        {" | Delay: "}
                        <span
                          className={
                            dep.delay > 0
                              ? "text-[#ff4d4f] font-semibold"
                              : dep.delay < 0
                              ? "text-[#4ade80] font-semibold"
                              : "text-[#f1f1f1] font-semibold"
                          }
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
