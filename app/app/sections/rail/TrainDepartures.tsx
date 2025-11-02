import { useEffect, useState } from "react";
import { FrontEndRailDeparturesSchema } from "../../validators/frontend-validators/RailDepartureSchema";
import Loading from "../../components/Loading";
import SectionHeading from "../../components/SectionHeading";
import DepartureError from "../../components/departures/DepartureError";
import DepartureList from "../../components/departures/DepartureList";

export type Departure = {
  url: string;
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
          `/api/departures/${props.fromStation.stationCode}/to/${props.toStation.stationCode}`,
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
      <SectionHeading className="text-white">Train Departures</SectionHeading>
      <div style={{ marginBottom: 16 }}>
        <span aria-label="Departure route">
          <strong>
            {`Departures from ${props.fromStation.stationName} to ${props.toStation.stationName}`}
          </strong>
        </span>
        {loading && <Loading />}
      </div>
      {error && (
        <DepartureError message="Could not find any services for the configured route." />
      )}
      {departures && <DepartureList departures={departures} />}
    </section>
  );
}
