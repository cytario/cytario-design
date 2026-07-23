import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Cloud } from "lucide-react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>Split Charge</Badge>);
    expect(screen.getByText("Split Charge")).toBeDefined();
  });

  it("renders as a span element", () => {
    const { container } = render(<Badge>Test</Badge>);
    expect(container.firstElementChild?.tagName).toBe("SPAN");
  });

  it("applies the default slate color", () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstElementChild?.className).toContain(
      "bg-badge-slate-bg",
    );
  });

  it("applies the specified color", () => {
    const { container } = render(<Badge color="purple">Brand</Badge>);
    expect(container.firstElementChild?.className).toContain(
      "bg-badge-purple-bg",
    );
  });

  it("always renders a border", () => {
    const { container } = render(<Badge>Bordered</Badge>);
    expect(container.firstElementChild?.className).toContain("border");
  });

  it("applies the xs size", () => {
    const { container } = render(<Badge size="xs">Tiny</Badge>);
    expect(container.firstElementChild?.className).toContain("px-1");
    expect(container.firstElementChild?.className).toContain("text-[10px]");
  });

  it("applies the sm size", () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    expect(container.firstElementChild?.className).toContain("px-1.5");
  });

  it("applies the md size", () => {
    const { container } = render(<Badge size="md">Medium</Badge>);
    expect(container.firstElementChild?.className).toContain("px-2");
  });

  it("applies the lg size", () => {
    const { container } = render(<Badge size="lg">Large</Badge>);
    expect(container.firstElementChild?.className).toContain("px-2.5");
    expect(container.firstElementChild?.className).toContain("text-sm");
  });

  it("renders an icon when provided", () => {
    const { container } = render(<Badge icon={Cloud}>AWS</Badge>);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not render an icon when not provided", () => {
    const { container } = render(<Badge>No Icon</Badge>);
    const svg = container.querySelector("svg");
    expect(svg).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Badge className="my-custom">Custom</Badge>,
    );
    expect(container.firstElementChild?.className).toContain("my-custom");
  });

  it("passes through DOM attributes", () => {
    const { container } = render(
      <Badge aria-label="Status label">Active</Badge>,
    );
    expect(container.firstElementChild?.getAttribute("aria-label")).toBe(
      "Status label",
    );
  });

  it("renders numeric children", () => {
    render(<Badge>{42}</Badge>);
    expect(screen.getByText("42")).toBeDefined();
  });
});
