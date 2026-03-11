import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DeltaIndicator } from "./DeltaIndicator";

describe("DeltaIndicator", () => {
  it("renders increase with positive sign", () => {
    render(<DeltaIndicator current={1200} previous={1000} />);
    expect(screen.getByText(/\+\$200/)).toBeDefined();
  });

  it("renders decrease with negative sign", () => {
    render(<DeltaIndicator current={800} previous={1000} />);
    expect(screen.getByText(/-\$200/)).toBeDefined();
  });

  it("renders flat change", () => {
    render(<DeltaIndicator current={1000} previous={1000} />);
    expect(screen.getByText(/\+\$0/)).toBeDefined();
  });

  it("renders increase color for cost increase", () => {
    const { container } = render(
      <DeltaIndicator current={1200} previous={1000} />,
    );
    expect(container.firstElementChild?.className).toContain(
      "text-(--color-delta-increase-text)",
    );
  });

  it("renders decrease color for cost decrease", () => {
    const { container } = render(
      <DeltaIndicator current={800} previous={1000} />,
    );
    expect(container.firstElementChild?.className).toContain(
      "text-(--color-delta-decrease-text)",
    );
  });

  it("reverses colors when reverseColor is true", () => {
    const { container } = render(
      <DeltaIndicator current={1200} previous={1000} reverseColor />,
    );
    // Increase with reverse = green (decrease color)
    expect(container.firstElementChild?.className).toContain(
      "text-(--color-delta-decrease-text)",
    );
  });

  it("renders label prefix", () => {
    render(<DeltaIndicator current={1200} previous={1000} label="MoM" />);
    expect(screen.getByText("MoM")).toBeDefined();
  });

  it("renders unavailable text", () => {
    render(<DeltaIndicator current={0} previous={0} unavailable />);
    expect(screen.getByText("N/A")).toBeDefined();
  });

  it("renders custom unavailable text", () => {
    render(
      <DeltaIndicator
        current={0}
        previous={0}
        unavailable
        unavailableText="N/A (MTD)"
      />,
    );
    expect(screen.getByText("N/A (MTD)")).toBeDefined();
  });

  it("renders currency format", () => {
    render(
      <DeltaIndicator current={1200} previous={1000} format="currency" />,
    );
    expect(screen.getByText(/\+\$200/)).toBeDefined();
  });

  it("renders percentage format", () => {
    render(
      <DeltaIndicator current={1200} previous={1000} format="percentage" />,
    );
    expect(screen.getByText(/\+20\.0%/)).toBeDefined();
  });

  it("renders combined format with both values", () => {
    render(
      <DeltaIndicator current={1200} previous={1000} format="combined" />,
    );
    expect(screen.getByText(/\+\$200.*\+20\.0%/)).toBeDefined();
  });

  it("handles new item (previous = 0)", () => {
    render(<DeltaIndicator current={1200} previous={0} />);
    expect(screen.getByText(/new/)).toBeDefined();
  });

  it("renders arrow up icon for increase", () => {
    const { container } = render(
      <DeltaIndicator current={1200} previous={1000} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders minus icon for flat change", () => {
    const { container } = render(
      <DeltaIndicator current={1000} previous={1000} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders pill mode with background", () => {
    const { container } = render(
      <DeltaIndicator current={1200} previous={1000} mode="pill" />,
    );
    expect(container.firstElementChild?.className).toContain(
      "bg-(--color-delta-increase-bg)",
    );
    expect(container.firstElementChild?.className).toContain(
      "rounded-full",
    );
  });

  it("renders inline mode without background by default", () => {
    const { container } = render(
      <DeltaIndicator current={1200} previous={1000} />,
    );
    expect(container.firstElementChild?.className).not.toContain(
      "bg-(--color-delta-increase-bg)",
    );
  });

  it("applies custom className", () => {
    const { container } = render(
      <DeltaIndicator current={1200} previous={1000} className="my-custom" />,
    );
    expect(container.firstElementChild?.className).toContain("my-custom");
  });
});
