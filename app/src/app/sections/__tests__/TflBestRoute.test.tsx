import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TflBestRoute from "../TfL/TflBestRoute";
import { useFetch } from "../../hooks/useFetch";

jest.mock("../../hooks/useFetch");
const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch>;

afterEach(() => {
  jest.clearAllMocks();
});

describe("TflBestRoute", () => {
  it("renders error message from thrown Error", async () => {
    mockUseFetch.mockReturnValue({
      data: null,
      loading: false,
      error: "Something went wrong",
    });
    render(
      <TflBestRoute
        from={{ placeName: "A", naptanOrAtco: "A" }}
        to={{ placeName: "B", naptanOrAtco: "B" }}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByText(/Error: Something went wrong/),
      ).toBeInTheDocument();
    });
  });

  it("renders error message from not ok response", async () => {
    mockUseFetch.mockReturnValue({
      data: null,
      loading: false,
      error: "Failed to fetch best route",
    });
    render(
      <TflBestRoute
        from={{ placeName: "A", naptanOrAtco: "A" }}
        to={{ placeName: "B", naptanOrAtco: "B" }}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to fetch best route/),
      ).toBeInTheDocument();
    });
  });

  it("renders 'Unknown error' for non-Error thrown values", async () => {
    mockUseFetch.mockReturnValue({
      data: null,
      loading: false,
      error: "Unknown error",
    });
    render(
      <TflBestRoute
        from={{ placeName: "A", naptanOrAtco: "A" }}
        to={{ placeName: "B", naptanOrAtco: "B" }}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText(/Error: Unknown error/)).toBeInTheDocument();
    });
  });
});
it("renders with mocked API data", async () => {
  const dummyData = {
    origin: "Paddington",
    destination: "Liverpool Street",
    route: [
      "Tube: Bakerloo line to Oxford Circus",
      "Bus: 176 to Liverpool Street",
    ],
    duration: 22,
    arrival: "2022-02-01T12:00:00.000Z",
  };

  mockUseFetch.mockReturnValue({
    data: dummyData,
    loading: false,
    error: null,
  });

  render(
    <TflBestRoute
      from={{ placeName: "Edgeware Road", naptanOrAtco: "PAD" }}
      to={{ placeName: "Liverpool Street", naptanOrAtco: "LST" }}
    />,
  );

  await waitFor(() => {
    expect(
      screen.getByRole("heading", { name: /Best Route/ }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Origin")).toHaveTextContent(
      "From: Edgeware Road",
    );
    expect(screen.getByLabelText("Destination")).toHaveTextContent(
      "To: Liverpool Street",
    );

    expect(
      screen.getByLabelText("Journey duration and arrival"),
    ).toHaveTextContent("Duration: 22 min|Arrival: 12:00");

    expect(screen.getByLabelText("Journey leg 1")).toHaveTextContent(
      "Tube: Bakerloo line to Oxford Circus",
    );
    expect(screen.getByLabelText("Journey leg 2")).toHaveTextContent(
      "Bus: 176 to Liverpool Street",
    );
  });
});
