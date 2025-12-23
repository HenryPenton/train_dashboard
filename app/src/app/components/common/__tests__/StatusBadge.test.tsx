import { render, screen, fireEvent } from "@testing-library/react";
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

  it("displays modal trigger when reason is provided", () => {
    const status = "Minor Delays";
    const severity = 6;
    const reason =
      "Central Line: Minor delays due to an earlier signal failure.";

    render(<StatusBadge status={status} severity={severity} reason={reason} />);

    const statusBadge = screen.getByRole("status");
    expect(statusBadge).toBeInTheDocument();

    // Check that aria-label indicates tap for details
    expect(statusBadge).toHaveAttribute(
      "aria-label",
      `Service status: ${status}, severity level ${severity}. Tap for details`,
    );

    // Check that title attribute is set for native tooltip
    expect(statusBadge).toHaveAttribute("title", reason);

    // Check that cursor-pointer class is applied when reason exists (for modal)
    expect(statusBadge).toHaveClass("cursor-pointer");

    // Check that badge is keyboard focusable when reason exists
    expect(statusBadge).toHaveAttribute("tabIndex", "0");
  });

  it("does not display modal trigger when reason is not provided", () => {
    const status = "Good Service";
    const severity = 10;

    render(<StatusBadge status={status} severity={severity} />);

    const statusBadge = screen.getByRole("status");
    expect(statusBadge).toBeInTheDocument();

    // Check that reason is NOT in aria-label
    expect(statusBadge).toHaveAttribute(
      "aria-label",
      `Service status: ${status}, severity level ${severity}`,
    );

    // Check that title attribute is not set
    expect(statusBadge).not.toHaveAttribute("title");

    // Check that cursor-pointer class is NOT applied
    expect(statusBadge).not.toHaveClass("cursor-pointer");

    // Check that badge is NOT keyboard focusable when no reason
    expect(statusBadge).not.toHaveAttribute("tabIndex");
  });

  it("does not display modal trigger when reason is empty string", () => {
    const status = "Good Service";
    const severity = 10;

    render(<StatusBadge status={status} severity={severity} reason="" />);

    const statusBadge = screen.getByRole("status");
    expect(statusBadge).not.toHaveAttribute("title");
    expect(statusBadge).not.toHaveClass("cursor-pointer");
  });

  it("does not display modal trigger when reason is null", () => {
    const status = "Good Service";
    const severity = 10;

    render(<StatusBadge status={status} severity={severity} reason={null} />);

    const statusBadge = screen.getByRole("status");
    expect(statusBadge).not.toHaveAttribute("title");
    expect(statusBadge).not.toHaveClass("cursor-pointer");
  });

  describe("Modal interactions", () => {
    const status = "Minor Delays";
    const severity = 6;
    const reason =
      "Central Line: Minor delays due to an earlier signal failure.";

    it("opens modal when badge is clicked", () => {
      render(
        <StatusBadge status={status} severity={severity} reason={reason} />,
      );

      const statusBadge = screen.getByRole("status");
      fireEvent.click(statusBadge);

      // Modal should be visible
      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveAttribute("aria-modal", "true");
    });

    it("displays the correct reason text in modal content", () => {
      render(
        <StatusBadge status={status} severity={severity} reason={reason} />,
      );

      const statusBadge = screen.getByRole("status");
      fireEvent.click(statusBadge);

      // Check modal title displays the status
      const modalTitle = screen.getByRole("heading", { name: status });
      expect(modalTitle).toBeInTheDocument();

      // Check reason text is displayed in the modal
      expect(screen.getByText(reason)).toBeInTheDocument();
    });

    it("closes modal when clicking the backdrop", () => {
      render(
        <StatusBadge status={status} severity={severity} reason={reason} />,
      );

      const statusBadge = screen.getByRole("status");
      fireEvent.click(statusBadge);

      // Modal should be open
      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();

      // Click the backdrop (the dialog element itself)
      fireEvent.click(modal);

      // Modal should be closed
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes modal when clicking the X close button", () => {
      render(
        <StatusBadge status={status} severity={severity} reason={reason} />,
      );

      const statusBadge = screen.getByRole("status");
      fireEvent.click(statusBadge);

      // Modal should be open
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Click the X close button (first button with name "Close" - has aria-label)
      const closeButtons = screen.getAllByRole("button", { name: "Close" });
      const xCloseButton = closeButtons[0];
      fireEvent.click(xCloseButton);

      // Modal should be closed
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes modal when clicking the bottom Close button", () => {
      render(
        <StatusBadge status={status} severity={severity} reason={reason} />,
      );

      const statusBadge = screen.getByRole("status");
      fireEvent.click(statusBadge);

      // Modal should be open
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Find the bottom "Close" button (text content)
      const closeButtons = screen.getAllByRole("button", { name: "Close" });
      // The second close button is the bottom one with text
      const bottomCloseButton = closeButtons[1];
      fireEvent.click(bottomCloseButton);

      // Modal should be closed
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("does not close modal when clicking inside the modal content", () => {
      render(
        <StatusBadge status={status} severity={severity} reason={reason} />,
      );

      const statusBadge = screen.getByRole("status");
      fireEvent.click(statusBadge);

      // Modal should be open
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Click on the reason text (inside the modal content)
      const reasonText = screen.getByText(reason);
      fireEvent.click(reasonText);

      // Modal should still be open
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("does not open modal when badge without reason is clicked", () => {
      render(<StatusBadge status={status} severity={severity} />);

      const statusBadge = screen.getByRole("status");
      fireEvent.click(statusBadge);

      // Modal should not be visible
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens modal when Enter key is pressed on badge", () => {
      render(
        <StatusBadge status={status} severity={severity} reason={reason} />,
      );

      const statusBadge = screen.getByRole("status");
      fireEvent.keyDown(statusBadge, { key: "Enter" });

      // Modal should be visible
      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();
    });

    it("opens modal when Space key is pressed on badge", () => {
      render(
        <StatusBadge status={status} severity={severity} reason={reason} />,
      );

      const statusBadge = screen.getByRole("status");
      fireEvent.keyDown(statusBadge, { key: " " });

      // Modal should be visible
      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();
    });

    it("does not open modal when other keys are pressed on badge", () => {
      render(
        <StatusBadge status={status} severity={severity} reason={reason} />,
      );

      const statusBadge = screen.getByRole("status");
      fireEvent.keyDown(statusBadge, { key: "Tab" });

      // Modal should not be visible
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes modal when Escape key is pressed", () => {
      render(
        <StatusBadge status={status} severity={severity} reason={reason} />,
      );

      const statusBadge = screen.getByRole("status");
      fireEvent.click(statusBadge);

      // Modal should be open
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Press Escape key
      fireEvent.keyDown(document, { key: "Escape" });

      // Modal should be closed
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("locks body scroll when modal is open", () => {
      render(
        <StatusBadge status={status} severity={severity} reason={reason} />,
      );

      // Body should not have overflow hidden initially
      expect(document.body.style.overflow).not.toBe("hidden");

      const statusBadge = screen.getByRole("status");
      fireEvent.click(statusBadge);

      // Body should have overflow hidden when modal is open
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("restores body scroll when modal is closed", () => {
      render(
        <StatusBadge status={status} severity={severity} reason={reason} />,
      );

      const statusBadge = screen.getByRole("status");
      fireEvent.click(statusBadge);

      // Modal should be open
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(document.body.style.overflow).toBe("hidden");

      // Close the modal
      const closeButtons = screen.getAllByRole("button", { name: "Close" });
      fireEvent.click(closeButtons[0]);

      // Body scroll should be restored
      expect(document.body.style.overflow).not.toBe("hidden");
    });

    it("has type='button' on both close buttons", () => {
      render(
        <StatusBadge status={status} severity={severity} reason={reason} />,
      );

      const statusBadge = screen.getByRole("status");
      fireEvent.click(statusBadge);

      const closeButtons = screen.getAllByRole("button", { name: "Close" });

      // Both close buttons should have type="button"
      expect(closeButtons[0]).toHaveAttribute("type", "button");
      expect(closeButtons[1]).toHaveAttribute("type", "button");
    });
  });
});
