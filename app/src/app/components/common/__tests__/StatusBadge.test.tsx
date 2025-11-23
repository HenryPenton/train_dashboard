import React from "react";
import { render, screen } from "@testing-library/react";
import StatusBadge from "../StatusBadge";

// Mock the color mapping utilities
jest.mock("../../../utils/colorMappings", () => ({
  getSeverityTextColor: jest.fn((severity: number) => {
    const colors: { [key: number]: string } = {
      1: "text-red-900",
      5: "text-orange-500",
      10: "text-green-400",
    };
    return colors[severity] || "text-gray-500";
  }),
  getSeverityBorderColor: jest.fn((severity: number) => {
    const colors: { [key: number]: string } = {
      1: "border-red-900",
      5: "border-orange-500",
      10: "border-green-400",
    };
    return colors[severity] || "border-gray-500";
  }),
}));

describe("StatusBadge", () => {
  it("renders status badge with proper accessibility attributes and content", () => {
    const status = "Good Service";
    const severity = 10;

    render(<StatusBadge status={status} severity={severity} />);

    // Check for status role and proper ARIA label
    const statusBadge = screen.getByRole("status", {
      name: `Service status: ${status}, severity level ${severity}`,
    });
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent(status);

    // Check that severity level is properly communicated
    expect(statusBadge).toHaveAttribute(
      "aria-label",
      `Service status: ${status}, severity level ${severity}`,
    );
  });

  it("handles unknown status correctly", () => {
    const severity = 5;

    render(<StatusBadge status="" severity={severity} />);

    const statusBadge = screen.getByRole("status", {
      name: `Service status: Unknown, severity level ${severity}`,
    });
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent("Unknown");
  });

  it("handles null status correctly", () => {
    const severity = 5;

    render(<StatusBadge status={""} severity={severity} />);

    const statusBadge = screen.getByRole("status", {
      name: `Service status: Unknown, severity level ${severity}`,
    });
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent("Unknown");
  });

  it("applies correct styling classes based on severity", () => {
    const status = "Minor Delays";
    const severity = 5;

    render(<StatusBadge status={status} severity={severity} />);

    const statusBadge = screen.getByRole("status");

    // Check base styling classes
    expect(statusBadge).toHaveClass(
      "text-sm",
      "font-semibold",
      "px-3",
      "py-1",
      "rounded-full",
      "border",
    );

    // Check that severity-based classes are applied (mocked functions return these)
    expect(statusBadge).toHaveClass("text-orange-500", "border-orange-500/50");
  });

  it("displays different severity levels correctly", () => {
    const testCases = [
      { status: "Severe Delays", severity: 1, expectedText: "Severe Delays" },
      { status: "Good Service", severity: 10, expectedText: "Good Service" },
      { status: "Part Closure", severity: 3, expectedText: "Part Closure" },
    ];

    testCases.forEach(({ status, severity, expectedText }) => {
      const { unmount } = render(
        <StatusBadge status={status} severity={severity} />,
      );

      const statusBadge = screen.getByRole("status", {
        name: `Service status: ${expectedText}, severity level ${severity}`,
      });
      expect(statusBadge).toBeInTheDocument();
      expect(statusBadge).toHaveTextContent(expectedText);

      unmount();
    });
  });

  it("maintains consistent structure across different statuses", () => {
    const status = "Planned Closure";
    const severity = 2;

    render(<StatusBadge status={status} severity={severity} />);

    const statusBadge = screen.getByRole("status");

    // Should always be a div with status role
    expect(statusBadge.tagName).toBe("DIV");
    expect(statusBadge).toHaveAttribute("role", "status");

    // Should always have consistent base classes
    expect(statusBadge).toHaveClass("text-sm", "font-semibold", "px-3", "py-1");
  });

  it("handles edge case severity values", () => {
    const status = "Test Status";
    const edgeSeverity = 999; // Should fall back to default

    render(<StatusBadge status={status} severity={edgeSeverity} />);

    const statusBadge = screen.getByRole("status", {
      name: `Service status: ${status}, severity level ${edgeSeverity}`,
    });
    expect(statusBadge).toBeInTheDocument();

    // Should still render with fallback styling
    expect(statusBadge).toHaveClass("text-gray-500", "border-gray-500/50");
  });
});
