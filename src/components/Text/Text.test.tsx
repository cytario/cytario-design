import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { Text } from "./Text";

describe("Text", () => {
  it("renders as a <p> by default", () => {
    render(<Text>Hello</Text>);
    const el = screen.getByText("Hello");
    expect(el.tagName).toBe("P");
  });

  it("renders as a <span> when as=span", () => {
    render(<Text as="span">Hello</Text>);
    const el = screen.getByText("Hello");
    expect(el.tagName).toBe("SPAN");
  });

  it("renders as a <div> when as=div", () => {
    render(<Text as="div">Hello</Text>);
    const el = screen.getByText("Hello");
    expect(el.tagName).toBe("DIV");
  });

  it("renders as a <label> when as=label", () => {
    render(<Text as="label">Label</Text>);
    const el = screen.getByText("Label");
    expect(el.tagName).toBe("LABEL");
  });

  // --- variant classes ---

  it("body variant: text-base text-foreground", () => {
    render(<Text variant="body">Body</Text>);
    const el = screen.getByText("Body");
    expect(el.className).toContain("text-base");
    expect(el.className).toContain("text-foreground");
  });

  it("small variant: text-sm text-foreground", () => {
    render(<Text variant="small">Small</Text>);
    const el = screen.getByText("Small");
    expect(el.className).toContain("text-sm");
    expect(el.className).toContain("text-foreground");
  });

  it("muted variant: text-sm text-muted-foreground", () => {
    render(<Text variant="muted">Muted</Text>);
    const el = screen.getByText("Muted");
    expect(el.className).toContain("text-sm");
    expect(el.className).toContain("text-muted-foreground");
  });

  it("caption variant: text-xs text-muted-foreground", () => {
    render(<Text variant="caption">Caption</Text>);
    const el = screen.getByText("Caption");
    expect(el.className).toContain("text-xs");
    expect(el.className).toContain("text-muted-foreground");
  });

  it("eyebrow variant: text-xs font-medium uppercase tracking-wide text-muted-foreground", () => {
    render(<Text variant="eyebrow">Eyebrow</Text>);
    const el = screen.getByText("Eyebrow");
    expect(el.className).toContain("text-xs");
    expect(el.className).toContain("font-medium");
    expect(el.className).toContain("uppercase");
    expect(el.className).toContain("tracking-wide");
    expect(el.className).toContain("text-muted-foreground");
  });

  it("eyebrow-bold variant: text-xs font-bold uppercase tracking-wider text-foreground", () => {
    render(<Text variant="eyebrow-bold">Bold Eyebrow</Text>);
    const el = screen.getByText("Bold Eyebrow");
    expect(el.className).toContain("text-xs");
    expect(el.className).toContain("font-bold");
    expect(el.className).toContain("uppercase");
    expect(el.className).toContain("tracking-wider");
    expect(el.className).toContain("text-foreground");
  });

  // --- weight override ---

  it("weight override applies via twMerge", () => {
    render(<Text variant="eyebrow" weight="bold">Bold Eyebrow</Text>);
    const el = screen.getByText("Bold Eyebrow");
    expect(el.className).toContain("font-bold");
    expect(el.className).not.toContain("font-medium");
  });

  it("weight override on body variant", () => {
    render(<Text weight="semibold">Semibold body</Text>);
    const el = screen.getByText("Semibold body");
    expect(el.className).toContain("font-semibold");
  });

  // --- className override via twMerge ---

  it("className can override variant size via twMerge", () => {
    render(<Text variant="body" className="text-lg">Overridden</Text>);
    const el = screen.getByText("Overridden");
    expect(el.className).toContain("text-lg");
    expect(el.className).not.toContain("text-base");
  });

  it("className can override variant tone via twMerge", () => {
    render(<Text variant="muted" className="text-foreground">Overridden</Text>);
    const el = screen.getByText("Overridden");
    expect(el.className).toContain("text-foreground");
    expect(el.className).not.toContain("text-muted-foreground");
  });

  // --- rest / ref forwarding ---

  it("forwards id to the rendered element", () => {
    render(<Text id="description">Text</Text>);
    const el = screen.getByText("Text");
    expect(el.id).toBe("description");
  });

  it("forwards data-* attributes", () => {
    render(<Text data-testid="custom-text" data-value="42">Data</Text>);
    const el = screen.getByTestId("custom-text");
    expect(el.getAttribute("data-value")).toBe("42");
  });

  it("forwards aria-* attributes", () => {
    render(<Text aria-label="Description" aria-describedby="desc-id">Aria</Text>);
    const el = screen.getByLabelText("Description");
    expect(el.getAttribute("aria-describedby")).toBe("desc-id");
  });

  it("forwards ref to the rendered element", () => {
    const ref = createRef<HTMLElement>();
    render(<Text ref={ref}>Ref Test</Text>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("P");
  });

  it("forwards onClick handler", async () => {
    let clicked = false;
    const { userEvent } = await import("@testing-library/user-event");
    render(<Text as="span" onClick={() => (clicked = true)}>Clickable</Text>);
    const el = screen.getByText("Clickable");
    await userEvent.click(el);
    expect(clicked).toBe(true);
  });
});
