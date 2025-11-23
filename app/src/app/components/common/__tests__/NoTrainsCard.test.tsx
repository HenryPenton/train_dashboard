import React from "react";
import { render, screen } from "@testing-library/react";
import NoTrainsCard from "../NoTrainsCard";
import { Station } from "../../sections/TrainDepartures";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function Link({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("NoTrainsCard", () => {
  const mockFromStation: Station = {
    stationCode: "PAD",
    stationName: "London Paddington",
  };

  const mockToStation: Station = {
    stationCode: "BRI",
    stationName: "Bristol Temple Meads",
  };

  test("renders no trains message with station names and accessibility features", () => {
    render(
      <NoTrainsCard fromStation={mockFromStation} toStation={mockToStation} />,
    );

    // Check for alert role and aria-label
    const noTrainsAlert = screen.getByRole("alert");
    expect(noTrainsAlert).toBeInTheDocument();
    expect(noTrainsAlert).toHaveAttribute(
      "aria-label",
      "No trains available between London Paddington and Bristol Temple Meads",
    );

    // Check that both station names are displayed
    expect(screen.getByText("London Paddington")).toBeInTheDocument();
    expect(screen.getByText("Bristol Temple Meads")).toBeInTheDocument();

    // Check for no services message
    expect(
      screen.getByText(/No services currently running between/),
    ).toBeInTheDocument();

    // Check for Real Time Trains link
    const realTimeTrainsLink = screen.getByRole("link", {
      name: /Check Real Time Trains/i,
    });
    expect(realTimeTrainsLink).toBeInTheDocument();
    expect(realTimeTrainsLink).toHaveAttribute("target", "_blank");
    expect(realTimeTrainsLink).toHaveAttribute(
      "href",
      "https://www.realtimetrains.co.uk/search/simple/gb-nr:PAD/to/gb-nr:BRI",
    );
  });
});
