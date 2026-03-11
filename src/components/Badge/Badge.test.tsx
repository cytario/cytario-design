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

  it("applies the default neutral variant", () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstElementChild?.className).toContain(
      "bg-(--color-badge-neutral-bg)",
    );
  });

  it("applies the specified variant", () => {
    const { container } = render(<Badge variant="purple">Brand</Badge>);
    expect(container.firstElementChild?.className).toContain(
      "bg-(--color-badge-purple-bg)",
    );
  });

  it("applies the specified size", () => {
    const { container } = render(<Badge size="md">Medium</Badge>);
    expect(container.firstElementChild?.className).toContain("px-2");
  });

  it("renders an icon when provided", () => {
    const { container } = render(
      <Badge icon={Cloud}>AWS</Badge>,
    );
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
});
