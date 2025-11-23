import React from "react";
import { render, screen } from "@testing-library/react";
import SectionCard from "../SectionCard";

describe("SectionCard", () => {
  it("renders section card with proper accessibility attributes and content", () => {
    const testContent = "This is test content for the section card";

    render(
      <SectionCard>
        <h2>Test Section</h2>
        <p>{testContent}</p>
      </SectionCard>,
    );

    // Check for the main region role
    const sectionRegion = screen.getByRole("region");
    expect(sectionRegion).toBeInTheDocument();

    // Check that content is rendered correctly
    expect(screen.getByText("Test Section")).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();

    // Check that the region contains all the content
    expect(sectionRegion).toContainElement(screen.getByText("Test Section"));
    expect(sectionRegion).toContainElement(screen.getByText(testContent));
  });

  it("applies custom className correctly", () => {
    const customClass = "custom-test-class another-class";

    render(
      <SectionCard className={customClass}>
        <div>Content with custom classes</div>
      </SectionCard>,
    );

    const sectionRegion = screen.getByRole("region");
    expect(sectionRegion).toHaveClass("custom-test-class", "another-class");

    // Should still have default classes
    expect(sectionRegion).toHaveClass("bg-[#23262f]", "p-6");
  });

  it("renders complex nested content correctly", () => {
    render(
      <SectionCard>
        <div>
          <h3>Nested Heading</h3>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
          <button>Action Button</button>
        </div>
      </SectionCard>,
    );

    const sectionRegion = screen.getByRole("region");

    // Check that all nested content is contained within the region
    expect(sectionRegion).toContainElement(screen.getByText("Nested Heading"));
    expect(sectionRegion).toContainElement(screen.getByText("Item 1"));
    expect(sectionRegion).toContainElement(screen.getByText("Item 2"));
    expect(sectionRegion).toContainElement(screen.getByText("Action Button"));

    // Check that interactive elements work correctly within the region
    const button = screen.getByRole("button", { name: "Action Button" });
    expect(button).toBeInTheDocument();
  });

  it("renders with empty content", () => {
    render(<SectionCard>{null}</SectionCard>);

    const sectionRegion = screen.getByRole("region");
    expect(sectionRegion).toBeInTheDocument();
    expect(sectionRegion).toBeEmptyDOMElement();
  });

  it("handles className prop when not provided", () => {
    render(
      <SectionCard>
        <p>Default styling test</p>
      </SectionCard>,
    );

    const sectionRegion = screen.getByRole("region");

    // Should have default classes but not throw errors
    expect(sectionRegion).toHaveClass("bg-[#23262f]", "p-6");
    expect(sectionRegion).not.toHaveClass("undefined", "null");
  });
});
