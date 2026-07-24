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

  it("applies responsive default classes based on heading level", () => {
    render(<Heading as="h1">Big</Heading>);
    const heading = screen.getByRole("heading", { name: "Big" });
    expect(heading.className).toContain("text-4xl");
    expect(heading.className).toContain("sm:text-5xl");
    expect(heading.className).toContain("leading-tight");
  });

  it("uses size prop to override visual size", () => {
    render(<Heading as="h3" size="h2">Custom</Heading>);
    const heading = screen.getByRole("heading", { name: "Custom" });
    expect(heading.className).toContain("text-2xl");
    expect(heading.className).toContain("sm:text-3xl");
    expect(heading.className).toContain("leading-tight");
  });

  it("applies custom className", () => {
    render(<Heading className="mt-4">Styled</Heading>);
    const heading = screen.getByRole("heading", { name: "Styled" });
    expect(heading.className).toContain("mt-4");
  });

  it("applies mb-4 by default", () => {
    render(<Heading>Margin</Heading>);
    expect(screen.getByRole("heading").className).toContain("mb-4");
  });

  it("allows className to override mb-4 via twMerge", () => {
    render(<Heading className="mb-12">Override</Heading>);
    const heading = screen.getByRole("heading", { name: "Override" });
    expect(heading.className).toContain("mb-12");
    expect(heading.className).not.toContain("mb-4");
  });

  // --- Weight derivation ---

  it("h1-h3 derive bold weight by default", () => {
    render(<Heading as="h2">Bold</Heading>);
    expect(screen.getByRole("heading").className).toContain("font-bold");
  });

  it("h4-h6 derive semibold weight by default", () => {
    render(<Heading as="h5">Semibold</Heading>);
    expect(screen.getByRole("heading").className).toContain("font-semibold");
  });

  it("weight is derived from size, not as", () => {
    render(<Heading as="h1" size="h4">Small Bold?</Heading>);
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("font-semibold");
    expect(heading.className).not.toContain("font-bold");
  });

  // --- color inheritance ---

  it("uses text-inherit so color flows from parent", () => {
    render(
      <div className="text-white">
        <Heading>White Heading</Heading>
      </div>,
    );
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-inherit");
  });

  it("allows className to override inherited color via twMerge", () => {
    render(<Heading className="text-red-500">Red</Heading>);
    expect(screen.getByRole("heading").className).toContain("text-red-500");
    expect(screen.getByRole("heading").className).not.toContain("text-inherit");
  });

  // --- twMerge override ---

  it("allows className to override base size via twMerge", () => {
    render(<Heading className="text-lg">Override</Heading>);
    const heading = screen.getByRole("heading", { name: "Override" });
    expect(heading.className).toContain("text-lg");
    expect(heading.className).not.toContain("text-2xl");
  });

  // --- ...rest forwarding ---

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

// --- Responsive sizes per level ---

describe("Heading responsive sizes", () => {
  it("h1 → text-4xl sm:text-5xl leading-tight", () => {
    render(<Heading size="h1">H1</Heading>);
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-4xl");
    expect(heading.className).toContain("sm:text-5xl");
    expect(heading.className).toContain("leading-tight");
  });

  it("h2 → text-2xl sm:text-3xl leading-tight", () => {
    render(<Heading size="h2">H2</Heading>);
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-2xl");
    expect(heading.className).toContain("sm:text-3xl");
    expect(heading.className).toContain("leading-tight");
  });

  it("hero → text-4xl sm:text-5xl lg:text-6xl leading-tight", () => {
    render(<Heading size="hero">Hero</Heading>);
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-4xl");
    expect(heading.className).toContain("sm:text-5xl");
    expect(heading.className).toContain("lg:text-6xl");
    expect(heading.className).toContain("leading-tight");
  });

  it("h3 → text-lg sm:text-xl leading-snug", () => {
    render(<Heading size="h3">H3</Heading>);
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-lg");
    expect(heading.className).toContain("sm:text-xl");
    expect(heading.className).toContain("leading-snug");
  });

  it("h4 → text-base sm:text-lg (no explicit leading)", () => {
    render(<Heading size="h4">H4</Heading>);
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-base");
    expect(heading.className).toContain("sm:text-lg");
    expect(heading.className).not.toMatch(/leading-/);
  });

  it("h5 → text-sm sm:text-base", () => {
    render(<Heading size="h5">H5</Heading>);
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-sm");
    expect(heading.className).toContain("sm:text-base");
  });

  it("h6 → text-sm (static)", () => {
    render(<Heading size="h6">H6</Heading>);
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-sm");
    expect(heading.className).not.toContain("sm:");
  });
});

// --- Convenience components ---

describe("Convenience components", () => {
  it("H1 renders as h1 with h1 styles and bold weight", () => {
    render(<H1>Title</H1>);
    const heading = screen.getByRole("heading", { name: "Title", level: 1 });
    expect(heading.className).toContain("text-4xl");
    expect(heading.className).toContain("sm:text-5xl");
    expect(heading.className).toContain("font-bold");
  });

  it("H2 renders as h2 with h2 styles and bold weight", () => {
    render(<H2>Subtitle</H2>);
    const heading = screen.getByRole("heading", {
      name: "Subtitle",
      level: 2,
    });
    expect(heading.className).toContain("text-2xl");
    expect(heading.className).toContain("sm:text-3xl");
    expect(heading.className).toContain("font-bold");
  });

  it("H3 renders as h3 with h3 styles and bold weight", () => {
    render(<H3>Section</H3>);
    const heading = screen.getByRole("heading", {
      name: "Section",
      level: 3,
    });
    expect(heading.className).toContain("text-lg");
    expect(heading.className).toContain("sm:text-xl");
    expect(heading.className).toContain("font-bold");
  });

  it("H4 renders as h4 with h4 styles and semibold weight", () => {
    render(<H4>Sub-section</H4>);
    const heading = screen.getByRole("heading", {
      name: "Sub-section",
      level: 4,
    });
    expect(heading.className).toContain("text-base");
    expect(heading.className).toContain("sm:text-lg");
    expect(heading.className).toContain("font-semibold");
  });

  it("H5 renders as h5 with h5 styles and semibold weight", () => {
    render(<H5>Minor heading</H5>);
    const heading = screen.getByRole("heading", {
      name: "Minor heading",
      level: 5,
    });
    expect(heading.className).toContain("text-sm");
    expect(heading.className).toContain("sm:text-base");
    expect(heading.className).toContain("font-semibold");
  });

  it("H6 renders as h6 with h6 styles and semibold weight", () => {
    render(<H6>Smallest heading</H6>);
    const heading = screen.getByRole("heading", {
      name: "Smallest heading",
      level: 6,
    });
    expect(heading.className).toContain("text-sm");
    expect(heading.className).toContain("font-semibold");
  });

  it("H1 with size='h2' uses h2 styles", () => {
    render(<H1 size="h2">Small H1</H1>);
    const heading = screen.getByRole("heading", { name: "Small H1", level: 1 });
    expect(heading.className).toContain("text-2xl");
    expect(heading.className).toContain("sm:text-3xl");
    expect(heading.className).toContain("font-bold");
  });

  it("H2 with size='h1' uses h1 styles", () => {
    render(<H2 size="h1">Big H2</H2>);
    const heading = screen.getByRole("heading", { name: "Big H2", level: 2 });
    expect(heading.className).toContain("text-4xl");
    expect(heading.className).toContain("sm:text-5xl");
    expect(heading.className).toContain("font-bold");
  });

  it("H3 with size='h4' uses h4 styles and semibold weight", () => {
    render(<H3 size="h4">Small H3</H3>);
    const heading = screen.getByRole("heading", {
      name: "Small H3",
      level: 3,
    });
    expect(heading.className).toContain("text-base");
    expect(heading.className).toContain("sm:text-lg");
    expect(heading.className).toContain("font-semibold");
    expect(heading.className).not.toContain("font-bold");
  });

  it("H1 className override works with twMerge", () => {
    render(<H1 className="text-lg">Small H1</H1>);
    const heading = screen.getByRole("heading", { name: "Small H1" });
    expect(heading.className).toContain("text-lg");
    expect(heading.className).not.toContain("text-4xl");
  });

  it("H1 forwards id via ...rest", () => {
    render(<H1 id="page-title">Title</H1>);
    const heading = screen.getByRole("heading", { name: "Title", level: 1 });
    expect(heading.id).toBe("page-title");
  });
});
