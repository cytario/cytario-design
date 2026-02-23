import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heading, H1, H2, H3 } from "./Heading";

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
    expect(heading.className).toContain("--font-size-3xl");
  });

  it("allows overriding size independently of heading level", () => {
    render(
      <Heading as="h3" size="2xl">
        Custom
      </Heading>,
    );
    const heading = screen.getByRole("heading", { name: "Custom" });
    expect(heading.className).toContain("--font-size-3xl");
  });

  it("applies custom className", () => {
    render(<Heading className="mt-4">Styled</Heading>);
    const heading = screen.getByRole("heading", { name: "Styled" });
    expect(heading.className).toContain("mt-4");
  });

  it("has font-weight-semibold by default", () => {
    render(<Heading>Bold</Heading>);
    const heading = screen.getByRole("heading", { name: "Bold" });
    expect(heading.className).toContain("--font-weight-semibold");
  });

  it("supports bold weight", () => {
    render(<Heading weight="bold">Heavy</Heading>);
    const heading = screen.getByRole("heading", { name: "Heavy" });
    expect(heading.className).toContain("--font-weight-bold");
  });

  it("renders 3xl size as font-size-4xl", () => {
    render(
      <Heading size="3xl">Extra Large</Heading>,
    );
    const heading = screen.getByRole("heading", { name: "Extra Large" });
    expect(heading.className).toContain("--font-size-4xl");
  });

  it("allows className to override internal size via twMerge", () => {
    render(<Heading className="text-lg">Override</Heading>);
    const heading = screen.getByRole("heading", { name: "Override" });
    // twMerge should resolve the conflict in favor of the consumer className
    expect(heading.className).toContain("text-lg");
    expect(heading.className).not.toContain("text-2xl");
  });
});

describe("Convenience components", () => {
  it("H1 renders as h1 with 2xl size", () => {
    render(<H1>Title</H1>);
    const heading = screen.getByRole("heading", { name: "Title", level: 1 });
    expect(heading.className).toContain("--font-size-3xl");
  });

  it("H1 uses font-bold by default", () => {
    render(<H1>Bold Title</H1>);
    const heading = screen.getByRole("heading", { name: "Bold Title" });
    expect(heading.className).toContain("--font-weight-bold");
  });

  it("H2 renders as h2 with xl size", () => {
    render(<H2>Subtitle</H2>);
    const heading = screen.getByRole("heading", {
      name: "Subtitle",
      level: 2,
    });
    expect(heading.className).toContain("--font-size-2xl");
  });

  it("H3 renders as h3 with lg size", () => {
    render(<H3>Section</H3>);
    const heading = screen.getByRole("heading", {
      name: "Section",
      level: 3,
    });
    expect(heading.className).toContain("--font-size-xl");
  });

  it("H1 className override works with twMerge", () => {
    render(<H1 className="text-lg">Small H1</H1>);
    const heading = screen.getByRole("heading", { name: "Small H1" });
    expect(heading.className).toContain("text-lg");
    expect(heading.className).not.toContain("--font-size-3xl");
  });
});
