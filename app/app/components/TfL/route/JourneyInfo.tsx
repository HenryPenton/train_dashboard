interface JourneyInfoProps {
  from: string;
  to: string;
  duration: number;
  arrival: string;
  fare: number | null;
}

export default function JourneyInfo({
  from,
  to,
  duration,
  arrival,
  fare,
}: JourneyInfoProps) {
  return (
    <>
      <div className="text-white mb-1" aria-label="Origin">
        <span className="font-bold">From:</span> {from}
      </div>
      <div className="text-white mb-1" aria-label="Destination">
        <span className="font-bold">To:</span> {to}
      </div>
      <div
        className="text-white mb-1"
        aria-label="Journey duration and arrival"
      >
        <span className="font-bold">Duration:</span> {duration} min
        <span className="mx-2">|</span>
        <span className="font-bold">Arrival:</span>{" "}
        {new Date(arrival).toLocaleTimeString()}
        {typeof fare === "number" && (
          <span>
            <span className="mx-2">|</span>
            <span className="font-bold">Fare:</span> £{(fare / 100).toFixed(2)}
          </span>
        )}
      </div>
    </>
  );
}
