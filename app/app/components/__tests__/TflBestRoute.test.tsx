import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TflBestRoute from "../TflBestRoute";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("TflBestRoute", () => {
  it("renders with mocked API data", async () => {
    const dummyData = {
      origin: "Paddington",
      destination: "Liverpool Street",
      route: [
        "Tube: Bakerloo line to Oxford Circus",
        "Bus: 176 to Liverpool Street",
      ],
      duration: 22,
      status: "Good Service",
    };

    jest.spyOn(global, "fetch").mockImplementation(async () => {
      return {
        ok: true,
        json: async () => dummyData,
      } as Response;
    });

    render(
      <TflBestRoute
        from={{ placeName: "Paddington", naptan: "PAD" }}
        to={{ placeName: "Liverpool Street", naptan: "LST" }}
      />
    );

    // Wait for the dummy data to be rendered
    await waitFor(() => {
      expect(screen.getByText(/Best Route/)).toBeInTheDocument();

      // Check for the 'From:' region with aria-label and origin
      const fromRegion = screen.getByRole("region", { name: /Origin/i });
      expect(fromRegion).toHaveTextContent("From: Paddington");

      // Check for the 'To:' region with aria-label and destination
      const toRegion = screen.getByRole("region", { name: /Destination/i });
      expect(toRegion).toHaveTextContent("To: Liverpool Street");

      expect(screen.getByText(/Paddington/)).toBeInTheDocument();
      expect(screen.getAllByText(/Liverpool Street/)).toHaveLength(2);

      expect(screen.getByText(/22 min/)).toBeInTheDocument();
      expect(screen.getByText(/Good Service/)).toBeInTheDocument();

      expect(screen.getByText(/176 to Liverpool Street/)).toBeInTheDocument();
      expect(
        screen.getByText(/Bakerloo line to Oxford Circus/)
      ).toBeInTheDocument();

      expect(screen.getByText(/Bus:/)).toBeInTheDocument();
      expect(screen.getByText(/Tube:/)).toBeInTheDocument();
    });
  });
});
