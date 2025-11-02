import { render, screen } from "@testing-library/react";
import TflLineStatusList from "../../TfL/TflLineStatusList";

describe("TflLineStatusList", () => {
  it("renders line statuses with correct aria-labels", () => {
    const tflStatuses = [
      { name: "Victoria", status: "Good Service", statusSeverity: 10 },
      { name: "Central", status: "Minor Delays", statusSeverity: 7 },
    ];
    render(<TflLineStatusList tflStatuses={tflStatuses} />);
    expect(screen.getByLabelText("Line Victoria")).toHaveTextContent(
      "Victoria",
    );
    expect(screen.getByLabelText("Line Central")).toHaveTextContent("Central");
    expect(screen.getByLabelText("Line status Good Service")).toHaveTextContent(
      "Good Service",
    );
    expect(screen.getByLabelText("Line status Minor Delays")).toHaveTextContent(
      "Minor Delays",
    );
  });

  it("renders default color when statusSeverity does not match color map", () => {
    const tflStatuses = [
      { name: "UnknownLine", status: "Unknown Status", statusSeverity: 99 },
    ];
    render(<TflLineStatusList tflStatuses={tflStatuses} />);
    const statusSpan = screen.getByLabelText("Line status Unknown Status");
    expect(statusSpan).toHaveClass("text-[#f1f1f1]");
    expect(statusSpan).toHaveTextContent("Unknown Status");
  });

  it("renders 'Unknown' in aria-label when line status is missing or falsy", () => {
    const tflStatuses = [
      { name: "Circle", status: "", statusSeverity: 5 },
      { name: "District", status: undefined as any, statusSeverity: 5 },
    ];
    render(<TflLineStatusList tflStatuses={tflStatuses} />);
    const circleStatus = screen.getAllByLabelText("Line status Unknown")[0];
    expect(circleStatus).toHaveTextContent("Unknown");
    const districtStatus = screen.getAllByLabelText("Line status Unknown")[1];
    expect(districtStatus).toHaveTextContent("Unknown");
  });
});
