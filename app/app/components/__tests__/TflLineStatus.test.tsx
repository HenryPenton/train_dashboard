import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TflLineStatus from "../TflLineStatus";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("TflLineStatus", () => {
  it("renders with mocked API data", async () => {
    const dummyData = [
      { name: "Victoria", status: "Good Service" },
      { name: "Northern", status: "Minor Delays" },
      { name: "Central", status: "Part Suspended" },
    ];

    jest.spyOn(global, "fetch").mockImplementation(async () => {
      return {
        ok: true,
        json: async () => dummyData,
      } as Response;
    });

    render(<TflLineStatus />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /TFL Line Status/ })
      ).toBeInTheDocument();

      expect(screen.getByRole("list")).toBeInTheDocument();

      expect(screen.getByLabelText("Line name Victoria")).toHaveTextContent(
        "Victoria"
      );
      expect(
        screen.getByLabelText("Line status Good Service")
      ).toHaveTextContent("Good Service");

      expect(screen.getByLabelText("Line name Northern")).toHaveTextContent(
        "Northern"
      );
      expect(
        screen.getByLabelText("Line status Minor Delays")
      ).toHaveTextContent("Minor Delays");

      expect(screen.getByLabelText("Line name Central")).toHaveTextContent(
        "Central"
      );
      expect(
        screen.getByLabelText("Line status Part Suspended")
      ).toHaveTextContent("Part Suspended");
    });
  });
});
