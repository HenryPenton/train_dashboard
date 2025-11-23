import React from "react";
import { render, screen } from "@testing-library/react";
import SectionHeading from "../SectionHeading";

describe("SectionHeading", () => {
  it("renders section heading with proper accessibility attributes and content", () => {
    const headingText = "Test Section Heading";

    render(<SectionHeading>{headingText}</SectionHeading>);

    // Check for heading with proper role and level
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(headingText);

    // Check that the heading has the correct aria-level attribute
    expect(heading).toHaveAttribute("aria-level", "2");

    // Check default styling classes are applied
    expect(heading).toHaveClass(
      "text-xl",
      "font-semibold",
      "mb-4",
      "text-cyan-300",
      "border-b",
      "border-cyan-600",
      "pb-2",
    );
  });

  it("applies custom className correctly", () => {
    const customClass = "custom-heading-class text-2xl";

    render(
      <SectionHeading className={customClass}>
        Custom Styled Heading
      </SectionHeading>,
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("custom-heading-class", "text-2xl");

    // Should still have default classes
    expect(heading).toHaveClass("text-xl", "font-semibold", "mb-4");
  });

  it("renders with custom aria-label when provided", () => {
    const customAriaLabel = "Custom accessibility label";

    render(
      <SectionHeading ariaLabel={customAriaLabel}>Heading Text</SectionHeading>,
    );

    const heading = screen.getByRole("heading", {
      level: 2,
      name: customAriaLabel,
    });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute("aria-label", customAriaLabel);
  });

  it("does not have aria-label when not provided", () => {
    render(<SectionHeading>Simple Heading</SectionHeading>);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).not.toHaveAttribute("aria-label");
  });

  it("renders complex content correctly", () => {
    render(
      <SectionHeading>
        <span>Complex</span> <strong>Heading</strong> Content
      </SectionHeading>,
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();

    // Check that complex content is rendered
    expect(screen.getByText("Complex")).toBeInTheDocument();
    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();

    // Check that the strong element is present
    const strongElement = heading.querySelector("strong");
    expect(strongElement).toBeInTheDocument();
    expect(strongElement).toHaveTextContent("Heading");
  });

  it("handles empty className prop gracefully", () => {
    render(<SectionHeading className="">Default Classes Only</SectionHeading>);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("text-xl", "font-semibold");
    expect(heading).not.toHaveClass("undefined", "null");
  });

  it("maintains semantic heading structure", () => {
    render(
      <div>
        <h1>Main Page Title</h1>
        <SectionHeading>Section Title</SectionHeading>
      </div>,
    );

    // Ensure the section heading is properly nested as h2 after h1
    const mainHeading = screen.getByRole("heading", { level: 1 });
    const sectionHeading = screen.getByRole("heading", { level: 2 });

    expect(mainHeading).toBeInTheDocument();
    expect(sectionHeading).toBeInTheDocument();
    expect(sectionHeading).toHaveTextContent("Section Title");
  });

  it("supports both ariaLabel and className props together", () => {
    const ariaLabel = "Custom label";
    const customClass = "custom-style";

    render(
      <SectionHeading ariaLabel={ariaLabel} className={customClass}>
        Heading with Both Props
      </SectionHeading>,
    );

    const heading = screen.getByRole("heading", {
      level: 2,
      name: ariaLabel,
    });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass(customClass);
    expect(heading).toHaveAttribute("aria-label", ariaLabel);
  });
});
