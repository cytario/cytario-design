import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { Heading, H1, H2, H3, H4, H5, H6 } from "./Heading";

describe("Heading", () => {
  it("renders as h2 by default", () => {
    render(<Heading>Title</Heading>);
    const heading = screen.getByRole("heading", { name: "Title", level: 2 });
    expect(heading).toBeDefined();
  });

  it("renders with the specified heading level", () => {
    render(<Heading as="h3">Section</Heading>);
    expect(
      screen.getByRole("heading", { name: "Section", level: 3 }),
    ).toBeDefined();
  });

  it("applies size class based on heading level by default", () => {
    render(<Heading as="h1">Big</Heading>);
    const heading = screen.getByRole("heading", { name: "Big" });
    expect(heading.className).toContain("text-6xl");
  });

  it("allows overriding size independently of heading level", () => {
    render(
      <Heading as="h3" size="2xl">
        Custom
      </Heading>,
    );
    const heading = screen.getByRole("heading", { name: "Custom" });
    expect(heading.className).toContain("text-3xl");
  });

  it("applies custom className", () => {
    render(<Heading className="mt-4">Styled</Heading>);
    const heading = screen.getByRole("heading", { name: "Styled" });
    expect(heading.className).toContain("mt-4");
  });

  it("has font-weight-semibold by default", () => {
    render(<Heading>Bold</Heading>);
    const heading = screen.getByRole("heading", { name: "Bold" });
    expect(heading.className).toContain("font-semibold");
  });

  it("supports medium weight", () => {
    render(<Heading weight="medium">Medium</Heading>);
    const heading = screen.getByRole("heading", { name: "Medium" });
    expect(heading.className).toContain("font-medium");
  });

  it("supports bold weight", () => {
    render(<Heading weight="bold">Heavy</Heading>);
    const heading = screen.getByRole("heading", { name: "Heavy" });
    expect(heading.className).toContain("font-bold");
  });

  it("renders 3xl size as font-size-4xl", () => {
    render(<Heading size="3xl">Extra Large</Heading>);
    const heading = screen.getByRole("heading", { name: "Extra Large" });
    expect(heading.className).toContain("text-4xl");
  });

  it("allows className to override internal size via twMerge", () => {
    render(<Heading className="text-lg">Override</Heading>);
    const heading = screen.getByRole("heading", { name: "Override" });
    expect(heading.className).toContain("text-lg");
    expect(heading.className).not.toContain("text-2xl");
  });

  // --- ...rest forwarding (the root-cause fix) ---

  it("forwards id to the rendered element", () => {
    render(<Heading id="my-section">Titled</Heading>);
    const heading = screen.getByRole("heading", { name: "Titled" });
    expect(heading.id).toBe("my-section");
  });

  it("forwards data-* attributes", () => {
    render(
      <Heading data-testid="custom-heading" data-value="42">
        Data
      </Heading>,
    );
    const heading = screen.getByTestId("custom-heading");
    expect(heading.getAttribute("data-value")).toBe("42");
  });

  it("forwards aria-* attributes", () => {
    render(
      <Heading aria-label="Custom label" aria-describedby="desc-id">
        Aria
      </Heading>,
    );
    const heading = screen.getByRole("heading", { name: "Custom label" });
    expect(heading.getAttribute("aria-describedby")).toBe("desc-id");
  });

  it("forwards ref to the rendered element", () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<Heading ref={ref}>Ref Test</Heading>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("H2");
  });

  it("forwards onClick handler", async () => {
    let clicked = false;
    const { userEvent } = await import("@testing-library/user-event");
    render(<Heading onClick={() => (clicked = true)}>Clickable</Heading>);
    const heading = screen.getByRole("heading", { name: "Clickable" });
    await userEvent.click(heading);
    expect(clicked).toBe(true);
  });
});

// --- Extended sizes ---

describe("Heading extended sizes", () => {
  it("renders 4xl size as text-5xl", () => {
    render(<Heading size="4xl">4xl</Heading>);
    expect(screen.getByRole("heading").className).toContain("text-5xl");
  });

  it("renders 5xl size as text-6xl", () => {
    render(<Heading size="5xl">5xl</Heading>);
    expect(screen.getByRole("heading").className).toContain("text-6xl");
  });
});

describe("Convenience components", () => {
  it("H1 renders as h1 with 5xl size", () => {
    render(<H1>Title</H1>);
    const heading = screen.getByRole("heading", { name: "Title", level: 1 });
    expect(heading.className).toContain("text-6xl");
  });

  it("H1 uses font-bold by default", () => {
    render(<H1>Bold Title</H1>);
    const heading = screen.getByRole("heading", { name: "Bold Title" });
    expect(heading.className).toContain("font-bold");
  });

  it("H2 renders as h2 with 3xl size and bold weight", () => {
    render(<H2>Subtitle</H2>);
    const heading = screen.getByRole("heading", {
      name: "Subtitle",
      level: 2,
    });
    expect(heading.className).toContain("text-4xl");
    expect(heading.className).toContain("font-bold");
  });

  it("H3 renders as h3 with 2xl size and bold weight", () => {
    render(<H3>Section</H3>);
    const heading = screen.getByRole("heading", {
      name: "Section",
      level: 3,
    });
    expect(heading.className).toContain("text-3xl");
    expect(heading.className).toContain("font-bold");
  });

  it("H4 renders as h4 with xl size", () => {
    render(<H4>Sub-section</H4>);
    const heading = screen.getByRole("heading", {
      name: "Sub-section",
      level: 4,
    });
    expect(heading.className).toContain("text-2xl");
  });

  it("H5 renders as h5 with lg size", () => {
    render(<H5>Minor heading</H5>);
    const heading = screen.getByRole("heading", {
      name: "Minor heading",
      level: 5,
    });
    expect(heading.className).toContain("text-xl");
  });

  it("H6 renders as h6 with sm size", () => {
    render(<H6>Smallest heading</H6>);
    const heading = screen.getByRole("heading", {
      name: "Smallest heading",
      level: 6,
    });
    expect(heading.className).toContain("text-base");
  });

  it("H1 className override works with twMerge", () => {
    render(<H1 className="text-lg">Small H1</H1>);
    const heading = screen.getByRole("heading", { name: "Small H1" });
    expect(heading.className).toContain("text-lg");
    expect(heading.className).not.toContain("text-6xl");
  });

  it("H1 forwards id via ...rest", () => {
    render(<H1 id="page-title">Title</H1>);
    const heading = screen.getByRole("heading", { name: "Title", level: 1 });
    expect(heading.id).toBe("page-title");
  });
});
