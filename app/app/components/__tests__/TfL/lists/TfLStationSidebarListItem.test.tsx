import { render, screen } from "@testing-library/react";
import TfLStationSidebarListItem from "../../../TfL/lists/TfLStationSidebarListItem";

describe("TfLStationSidebarListItem", () => {
  it("renders station name", () => {
    const item = { CommonName: "Oxford Circus", naptanID: "940GZZLUOXC" };
    render(
      <TfLStationSidebarListItem
        item={item}
        matchingId={null}
        onClick={() => {}}
      />,
    );
    expect(screen.getByText(/Oxford Circus/)).toBeInTheDocument();
  });

  it("calls onClick with the correct id when clicked", () => {
    const item = { CommonName: "Liverpool Street", naptanID: "940GZZLULVT" };
    const handleClick = jest.fn();
    render(
      <TfLStationSidebarListItem
        item={item}
        matchingId={null}
        onClick={handleClick}
      />,
    );
    const li = screen.getByText("Liverpool Street").closest("li");
    li && li.click();
    expect(handleClick).toHaveBeenCalledWith("940GZZLULVT");
  });
  
  it("applies blue highlight when selected", () => {
    const item = { CommonName: "Paddington", naptanID: "940GZZLUPAD" };
    render(
      <TfLStationSidebarListItem
        item={item}
        matchingId={"940GZZLUPAD"}
        onClick={() => {}}
      />,
    );
    const li = screen.getByText("Paddington").closest("li");
    expect(li).toHaveClass("bg-blue-100");
  });

  it("does not apply blue highlight when not selected", () => {
    const item = { CommonName: "Baker Street", naptanID: "940GZZLUBST" };
    render(
      <TfLStationSidebarListItem
        item={item}
        matchingId={"940GZZLUPAD"}
        onClick={() => {}}
      />,
    );
    const li = screen.getByText("Baker Street").closest("li");
    expect(li).not.toHaveClass("bg-blue-100");
  });
});
