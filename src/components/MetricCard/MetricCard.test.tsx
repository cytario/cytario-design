import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetricCard } from "./MetricCard";

describe("MetricCard", () => {
  it("renders label and value", () => {
    render(<MetricCard label="Total Spend" value="$22,100" />);
    expect(screen.getByText("Total Spend")).toBeDefined();
    expect(screen.getByText("$22,100")).toBeDefined();
  });

  it("renders as a div by default", () => {
    const { container } = render(
      <MetricCard label="Test" value="$100" />,
    );
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("renders as an anchor when href is provided", () => {
    const { container } = render(
      <MetricCard label="Test" value="$100" href="/detail" />,
    );
    expect(container.firstElementChild?.tagName).toBe("A");
    expect(container.firstElementChild?.getAttribute("href")).toBe("/detail");
  });

  it("renders secondary content", () => {
    render(
      <MetricCard
        label="Total Spend"
        value="$22,100"
        secondary="12 workloads"
      />,
    );
    expect(screen.getByText("12 workloads")).toBeDefined();
  });

  it("does not render secondary when not provided", () => {
    const { container } = render(
      <MetricCard label="Test" value="$100" />,
    );
    const secondaryDivs = container.querySelectorAll(".mt-1.text-sm");
    expect(secondaryDivs).toHaveLength(0);
  });

  it("applies sm size styles", () => {
    const { container } = render(
      <MetricCard label="Test" value="$100" size="sm" />,
    );
    expect(container.firstElementChild?.className).toContain("p-3");
  });

  it("applies md size styles by default", () => {
    const { container } = render(
      <MetricCard label="Test" value="$100" />,
    );
    expect(container.firstElementChild?.className).toContain("p-4");
  });

  it("applies hover styles when href is set", () => {
    const { container } = render(
      <MetricCard label="Test" value="$100" href="#" />,
    );
    expect(container.firstElementChild?.className).toContain(
      "hover:shadow-md",
    );
  });

  it("does not apply hover styles without href", () => {
    const { container } = render(
      <MetricCard label="Test" value="$100" />,
    );
    expect(container.firstElementChild?.className).not.toContain(
      "hover:shadow-md",
    );
  });

  it("applies custom className", () => {
    const { container } = render(
      <MetricCard label="Test" value="$100" className="my-custom" />,
    );
    expect(container.firstElementChild?.className).toContain("my-custom");
  });

  it("renders ReactNode as value", () => {
    render(
      <MetricCard label="Test" value={<span data-testid="custom">Custom</span>} />,
    );
    expect(screen.getByTestId("custom")).toBeDefined();
  });
});
