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
  }: {
    status: string;
    severity: number;
  }) {
    return (
      <div
        data-testid="status-badge"
        data-status={status}
        data-severity={severity}
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
    const testStatusList = ["Good Service", "Minor Delays"];
    const testSeverity = 2;

    render(
      <LineStatusCard
        name={testName}
        statusList={testStatusList}
        severity={testSeverity}
      />,
    );

    // Check main article element with proper aria-label
    const article = screen.getByRole("article", {
      name: `${testName} line status: ${testStatusList.join(", ")}`,
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

  it("renders with unknown status when statusList is empty", () => {
    const testName = "District Line";
    const emptyStatusList: string[] = [];
    const testSeverity = 1;

    render(
      <LineStatusCard
        name={testName}
        statusList={emptyStatusList}
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
});
