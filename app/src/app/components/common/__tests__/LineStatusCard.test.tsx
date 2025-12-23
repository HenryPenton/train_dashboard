import { render, screen } from "@testing-library/react";
import LineStatusCard from "../LineStatusCard";

// Mock the dependent components
jest.mock("../StatusBar", () => {
  return function MockStatusBar({
    backgroundColor,
  }: {
    backgroundColor: string;
  }) {
    return <div data-testid="status-bar" style={{ backgroundColor }} />;
  };
});

jest.mock("../StatusBadge", () => {
  return function MockStatusBadge({
    status,
    severity,
    reason,
  }: {
    status: string;
    severity: number;
    reason?: string | null;
  }) {
    return (
      <div
        data-testid="status-badge"
        data-status={status}
        data-severity={severity}
        data-reason={reason || ""}
      >
        {status}
      </div>
    );
  };
});

// Mock the color mapping utilities
jest.mock("../../../utils/colorMappings", () => ({
  getSeverityStatusBarColor: jest.fn(() => "#00ff00"),
  getSeverityBorderColor: jest.fn(() => "border-green-500"),
}));

describe("LineStatusCard", () => {
  it("renders line status card with proper accessibility attributes and content", () => {
    const testName = "Central Line";
    const testStatuses = [
      { status: "Good Service", reason: null },
      { status: "Minor Delays", reason: null },
    ];
    const testSeverity = 2;

    render(
      <LineStatusCard
        name={testName}
        statuses={testStatuses}
        severity={testSeverity}
      />,
    );

    // Check main article element with proper aria-label
    const article = screen.getByRole("article", {
      name: `${testName} line status: Good Service, Minor Delays`,
    });
    expect(article).toBeInTheDocument();

    // Check line name heading
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(testName);

    // Check status list container
    const statusList = screen.getByRole("list", { name: "Status list" });
    expect(statusList).toBeInTheDocument();

    // Check status badges are rendered
    const statusBadges = screen.getAllByTestId("status-badge");
    expect(statusBadges).toHaveLength(2);
    expect(statusBadges[0]).toHaveTextContent("Good Service");
    expect(statusBadges[1]).toHaveTextContent("Minor Delays");

    // Check status bar is rendered
    const statusBar = screen.getByTestId("status-bar");
    expect(statusBar).toBeInTheDocument();
  });

  it("renders with unknown status when statuses is empty", () => {
    const testName = "District Line";
    const emptyStatuses: { status: string; reason?: string | null }[] = [];
    const testSeverity = 1;

    render(
      <LineStatusCard
        name={testName}
        statuses={emptyStatuses}
        severity={testSeverity}
      />,
    );

    // Check article with unknown status in aria-label
    const article = screen.getByRole("article", {
      name: `${testName} line status: Unknown`,
    });
    expect(article).toBeInTheDocument();

    // Check that unknown status badge is rendered
    const statusBadge = screen.getByTestId("status-badge");
    expect(statusBadge).toHaveTextContent("Unknown");
  });

  it("passes reason to StatusBadge components when provided", () => {
    const testName = "Central Line";
    const testReason = "Central Line: Minor delays due to an earlier signal failure.";
    const testStatuses = [{ status: "Minor Delays", reason: testReason }];
    const testSeverity = 6;

    render(
      <LineStatusCard
        name={testName}
        statuses={testStatuses}
        severity={testSeverity}
      />,
    );

    const statusBadge = screen.getByTestId("status-badge");
    expect(statusBadge).toHaveAttribute("data-reason", testReason);
  });

  it("passes empty reason to StatusBadge when reason is not provided", () => {
    const testName = "Victoria Line";
    const testStatuses = [{ status: "Good Service", reason: null }];
    const testSeverity = 10;

    render(
      <LineStatusCard
        name={testName}
        statuses={testStatuses}
        severity={testSeverity}
      />,
    );

    const statusBadge = screen.getByTestId("status-badge");
    expect(statusBadge).toHaveAttribute("data-reason", "");
  });

  it("renders multiple statuses with different reasons", () => {
    const testName = "Northern Line";
    const testStatuses = [
      { status: "Minor Delays", reason: "Signal failure at Camden" },
      { status: "Part Suspended", reason: "Engineering works between Moorgate and Kennington" },
    ];
    const testSeverity = 4;

    render(
      <LineStatusCard
        name={testName}
        statuses={testStatuses}
        severity={testSeverity}
      />,
    );

    const statusBadges = screen.getAllByTestId("status-badge");
    expect(statusBadges).toHaveLength(2);
    expect(statusBadges[0]).toHaveAttribute("data-reason", "Signal failure at Camden");
    expect(statusBadges[1]).toHaveAttribute("data-reason", "Engineering works between Moorgate and Kennington");
  });
});
