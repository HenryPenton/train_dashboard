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
      status: "OK",
    };

    jest.spyOn(global, "fetch").mockImplementation(async () => {
      return {
        ok: true,
        json: async () => dummyData,
      } as Response;
    });

    render(
      <TflBestRoute
        from={{ placeName: "Edgeware Road", naptan: "PAD" }}
        to={{ placeName: "Liverpool Street", naptan: "LST" }}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Best Route/ })
      ).toBeInTheDocument();

      expect(screen.getByLabelText("Origin")).toHaveTextContent(
        "From: Edgeware Road"
      );
      expect(screen.getByLabelText("Destination")).toHaveTextContent(
        "To: Liverpool Street"
      );

      expect(screen.getByLabelText("Journey duration")).toHaveTextContent(
        "Duration: 22 min"
      );

      expect(screen.getByLabelText("Journey leg 1")).toHaveTextContent(
        "Tube: Bakerloo line to Oxford Circus"
      );
      expect(screen.getByLabelText("Journey leg 2")).toHaveTextContent(
        "Bus: 176 to Liverpool Street"
      );
    });
  });
});
