import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Dot } from "./Dot";

describe("Dot", () => {
  it("renders as a span element", () => {
    const { container } = render(<Dot />);
    expect(container.firstElementChild?.tagName).toBe("SPAN");
  });

  it("applies the default neutral color", () => {
    const { container } = render(<Dot />);
    expect(container.firstElementChild?.className).toContain(
      "bg-muted-foreground text-muted-foreground",
    );
  });

  it("applies the accent color via the ring token", () => {
    const { container } = render(<Dot color="accent" />);
    expect(container.firstElementChild?.className).toContain(
      "bg-ring text-ring",
    );
  });

  it("applies the specified color", () => {
    const { container } = render(<Dot color="destructive" />);
    expect(container.firstElementChild?.className).toContain(
      "bg-destructive text-destructive",
    );
  });

  it("applies the sm size", () => {
    const { container } = render(<Dot size="sm" />);
    expect(container.firstElementChild?.className).toContain("w-2");
    expect(container.firstElementChild?.className).toContain("h-2");
  });

  it("applies the md size", () => {
    const { container } = render(<Dot />);
    expect(container.firstElementChild?.className).toContain("w-2.5");
    expect(container.firstElementChild?.className).toContain("h-2.5");
  });

  it("applies the lg size", () => {
    const { container } = render(<Dot size="lg" />);
    expect(container.firstElementChild?.className).toContain("w-3");
    expect(container.firstElementChild?.className).toContain("h-3");
  });

  it("does not animate by default", () => {
    const { container } = render(<Dot />);
    expect(container.firstElementChild?.className).not.toContain("animate");
  });

  it("animates the pulse when pulse is set", () => {
    const { container } = render(<Dot pulse />);
    expect(container.firstElementChild?.className).toContain(
      "animate-dot-pulse",
    );
  });

  it("applies custom className", () => {
    const { container } = render(<Dot className="my-custom" />);
    expect(container.firstElementChild?.className).toContain("my-custom");
  });

  it("passes through DOM attributes", () => {
    const { container } = render(<Dot aria-label="Status label" />);
    expect(container.firstElementChild?.getAttribute("aria-label")).toBe(
      "Status label",
    );
  });

  it("forwards the ref", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Dot ref={ref} />);
    expect(ref.current?.tagName).toBe("SPAN");
  });

  it("renders no text content", () => {
    render(<Dot />);
    expect(screen.queryByText(/./)).toBeNull();
  });
});
