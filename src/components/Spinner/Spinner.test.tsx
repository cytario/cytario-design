import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders as decorative by default", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("is announced to screen readers when aria-label is provided", () => {
    render(<Spinner aria-label="Loading content" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("aria-label", "Loading content");
    expect(spinner).not.toHaveAttribute("aria-hidden");
  });

  it("applies size classes", () => {
    const { container: sm } = render(<Spinner size="sm" />);
    expect(sm.querySelector("svg")?.getAttribute("class")).toContain("h-4 w-4");

    const { container: md } = render(<Spinner size="md" />);
    expect(md.querySelector("svg")?.getAttribute("class")).toContain("h-5 w-5");

    const { container: lg } = render(<Spinner size="lg" />);
    expect(lg.querySelector("svg")?.getAttribute("class")).toContain("h-6 w-6");
  });

  it("applies custom className", () => {
    const { container } = render(<Spinner className="text-red-500" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("text-red-500");
  });
});
