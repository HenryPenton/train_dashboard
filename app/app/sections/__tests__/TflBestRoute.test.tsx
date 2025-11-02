import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TflBestRoute from "../TfL/TflBestRoute";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("TflBestRoute", () => {
  it("renders error message from thrown Error", async () => {
    jest.spyOn(global, "fetch").mockImplementation(async () => {
      throw new Error("Something went wrong");
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
    jest.spyOn(global, "fetch").mockImplementation(async () => {
      return {
        ok: false,
        statusText: "Not Found",
      } as Response;
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
    jest.spyOn(global, "fetch").mockImplementation(async () => {
      throw "not an error object";
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

  jest.spyOn(global, "fetch").mockImplementation(async () => {
    return {
      ok: true,
      json: async () => dummyData,
    } as Response;
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
    ).toHaveTextContent("Duration: 22 min|Arrival: 12:00:00");

    expect(screen.getByLabelText("Journey leg 1")).toHaveTextContent(
      "Tube: Bakerloo line to Oxford Circus",
    );
    expect(screen.getByLabelText("Journey leg 2")).toHaveTextContent(
      "Bus: 176 to Liverpool Street",
    );
  });
});
