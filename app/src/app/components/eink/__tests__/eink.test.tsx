import { render, screen } from "@testing-library/react";
import EinkDepartures from "../EinkDepartures";
import EinkArrivals from "../EinkArrivals";
import EinkBestRoute from "../EinkBestRoute";
import EinkLineStatus from "../EinkLineStatus";
import { useFetch } from "../../../hooks/useFetch";

jest.mock("../../../hooks/useFetch");
const mockUseFetch = useFetch as jest.Mock;

const ready = (data: unknown) => ({ data, loading: false, error: null });

describe("EinkDepartures", () => {
  const stations = {
    fromStation: { stationCode: "AAA", stationName: "Alpha" },
    toStation: { stationCode: "BBB", stationName: "Beta" },
  };

  it("labels delayed and cancelled trains with text", () => {
    mockUseFetch.mockReturnValue(
      ready([
        {
          scheduledDepartureTime: "10:00",
          estimatedDepartureTime: "10:05",
          status: "Late",
          delay: 5,
          platform: "3",
          serviceId: "1",
        },
        {
          scheduledDepartureTime: "10:30",
          estimatedDepartureTime: "10:30",
          status: "Cancelled",
          serviceId: "2",
        },
        {
          scheduledDepartureTime: "11:00",
          estimatedDepartureTime: "11:00",
          status: "On time",
          serviceId: "3",
        },
      ]),
    );
    render(<EinkDepartures {...stations} />);
    expect(screen.getByText("Alpha to Beta")).toBeInTheDocument();
    expect(screen.getByText("DELAYED 5 min")).toBeInTheDocument();
    expect(screen.getByText("CANCELLED")).toBeInTheDocument();
    expect(screen.getByText("On time")).toBeInTheDocument();
    expect(screen.getByText(/Plat 3/)).toBeInTheDocument();
  });

  it("shows loading, error and empty states", () => {
    mockUseFetch.mockReturnValue({ data: null, loading: true, error: null });
    const { rerender } = render(<EinkDepartures {...stations} />);
    expect(screen.getByText(/Loading departures/)).toBeInTheDocument();

    mockUseFetch.mockReturnValue({ data: null, loading: false, error: "boom" });
    rerender(<EinkDepartures {...stations} />);
    expect(screen.getByText(/Error: boom/)).toBeInTheDocument();

    mockUseFetch.mockReturnValue(ready([]));
    rerender(<EinkDepartures {...stations} />);
    expect(screen.getByText("No trains found.")).toBeInTheDocument();
  });
});

describe("EinkArrivals", () => {
  it("renders arrivals per line and platform", () => {
    mockUseFetch.mockReturnValue(
      ready({
        lines: {
          central: {
            lineName: "Central",
            arrivals: {
              Eastbound: [
                { id: "1", towards: "Epping", timeToStation: 30 },
                { id: "2", towards: "Hainault", timeToStation: 240 },
              ],
            },
          },
        },
      }),
    );
    render(<EinkArrivals stationId="940G" stationName="Bank" />);
    expect(screen.getByText("Bank")).toBeInTheDocument();
    expect(screen.getByText("Central")).toBeInTheDocument();
    expect(screen.getByText("Due")).toBeInTheDocument();
    expect(screen.getByText("4 min")).toBeInTheDocument();
    expect(screen.getByText(/Epping/)).toBeInTheDocument();
  });
});

describe("EinkBestRoute", () => {
  it("renders duration, fare and legs", () => {
    mockUseFetch.mockReturnValue(
      ready({
        duration: 42,
        arrival: "2026-01-01T10:42:00",
        fare: 280,
        legs: [
          {
            mode: "tube",
            instruction: "Central line to Bank",
            departure: "2026-01-01T10:00:00",
            arrival: "2026-01-01T10:20:00",
            line: "Central",
          },
        ],
      }),
    );
    render(
      <EinkBestRoute
        from={{ placeName: "Home", naptanOrAtco: "a" }}
        to={{ placeName: "Work", naptanOrAtco: "b" }}
      />,
    );
    expect(screen.getByText("Route: Home to Work")).toBeInTheDocument();
    expect(screen.getByText("42 min")).toBeInTheDocument();
    expect(screen.getByText(/£2\.80/)).toBeInTheDocument();
    expect(screen.getByText(/Central line to Bank/)).toBeInTheDocument();
  });
});

describe("EinkLineStatus", () => {
  it("uppercases disruptions but not good service", () => {
    mockUseFetch.mockReturnValue(
      ready([
        {
          name: "Central",
          statuses: [{ status: "Good Service" }],
          statusSeverity: 10,
        },
        {
          name: "Jubilee",
          statuses: [{ status: "Severe Delays" }],
          statusSeverity: 3,
        },
      ]),
    );
    render(<EinkLineStatus />);
    expect(screen.getByText("Good Service")).toBeInTheDocument();
    expect(screen.getByText("SEVERE DELAYS")).toBeInTheDocument();
  });
});
