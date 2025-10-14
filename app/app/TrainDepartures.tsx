import { useState, useEffect } from "react";

type Departure = {
  origin: string;
  destination: string;
  scheduled: string | null;
  platform: string | null;
  delay: number | null;
};

export default function TrainDepartures() {
  const [departures, setDepartures] = useState<Departure[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartures = async () => {
      setLoading(true);
      setError("");
      setDepartures(null);
      try {
        const res = await fetch(`/api/departures`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setDepartures(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartures();
  }, []);

  return (
    <section className="flex-1 min-w-[320px] bg-[#23262f] rounded-[12px] p-6 text-[#f1f1f1] shadow-[0_2px_12px_0_rgba(0,0,0,0.25)] max-[900px]:p-4">
      <h2>Train Departures</h2>
      <div style={{ marginBottom: 16 }}>
        <span>
          Departures from <strong>RDG</strong> to <strong>PADTON</strong>
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
                  className="mb-4 text-[1.08rem] bg-[#23262f] rounded-[8px] p-[12px_14px] shadow-[0_1px_4px_0_rgba(0,0,0,0.13)]"
                >
                  <strong>{dep.origin}</strong> →{" "}
                  <strong>{dep.destination}</strong>
                  <br />
                  <span>
                    Scheduled: {dep.scheduled || "-"} | Platform:{" "}
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
