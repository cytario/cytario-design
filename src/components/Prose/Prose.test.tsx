import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { Prose } from "./Prose";

const sampleContent = (
  <>
    <h2>Overview</h2>
    <p>
      This is a paragraph with <strong>bold</strong> and <em>italic</em> text.
    </p>
    <ul>
      <li>First item</li>
      <li>Second item</li>
    </ul>
    <blockquote>A notable quote.</blockquote>
    <pre>
      <code>const x = 42;</code>
    </pre>
  </>
);

describe("Prose", () => {
  it("renders children", () => {
    render(<Prose>{sampleContent}</Prose>);
    expect(screen.getByText("Overview")).toBeTruthy();
    expect(screen.getByText("First item")).toBeTruthy();
    expect(screen.getByText("A notable quote.")).toBeTruthy();
  });

  it("applies the base `prose` class by default", () => {
    render(<Prose>{sampleContent}</Prose>);
    const container = screen.getByText("Overview").parentElement!;
    expect(container.className).toContain("prose");
  });

  it("applies prose-sm when size=sm", () => {
    render(<Prose size="sm">{sampleContent}</Prose>);
    const container = screen.getByText("Overview").parentElement!;
    expect(container.className).toContain("prose-sm");
  });

  it("applies prose-lg when size=lg", () => {
    render(<Prose size="lg">{sampleContent}</Prose>);
    const container = screen.getByText("Overview").parentElement!;
    expect(container.className).toContain("prose-lg");
  });

  it("applies prose-xl when size=xl", () => {
    render(<Prose size="xl">{sampleContent}</Prose>);
    const container = screen.getByText("Overview").parentElement!;
    expect(container.className).toContain("prose-xl");
  });

  it("applies prose-invert when invert=true", () => {
    render(<Prose invert>{sampleContent}</Prose>);
    const container = screen.getByText("Overview").parentElement!;
    expect(container.className).toContain("prose-invert");
  });

  it("always applies max-w-none", () => {
    render(<Prose>{sampleContent}</Prose>);
    const container = screen.getByText("Overview").parentElement!;
    expect(container.className).toContain("max-w-none");
  });

  it("className can override max-w-none via twMerge", () => {
    render(<Prose className="max-w-prose">{sampleContent}</Prose>);
    const container = screen.getByText("Overview").parentElement!;
    expect(container.className).toContain("max-w-prose");
    expect(container.className).not.toContain("max-w-none");
  });

  it("forwards id to the container", () => {
    render(<Prose id="article-body">{sampleContent}</Prose>);
    const container = screen.getByText("Overview").parentElement!;
    expect(container.id).toBe("article-body");
  });

  it("forwards data-* attributes", () => {
    render(<Prose data-testid="prose-content" data-value="42">{sampleContent}</Prose>);
    const container = screen.getByTestId("prose-content");
    expect(container.getAttribute("data-value")).toBe("42");
  });

  it("forwards ref to the container div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Prose ref={ref}>{sampleContent}</Prose>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("DIV");
  });

  it("forwards onClick handler", async () => {
    let clicked = false;
    const { userEvent } = await import("@testing-library/user-event");
    render(<Prose onClick={() => (clicked = true)}>{sampleContent}</Prose>);
    const container = screen.getByText("Overview").parentElement!;
    await userEvent.click(container);
    expect(clicked).toBe(true);
  });
});
