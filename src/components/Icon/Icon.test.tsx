import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heart } from "lucide-react";
import { Icon } from "./Icon";

describe("Icon", () => {
  it("renders as decorative by default", () => {
    const { container } = render(<Icon icon={Heart} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("is meaningful when aria-label is provided", () => {
    render(<Icon icon={Heart} aria-label="Favorite" />);
    const icon = screen.getByRole("img", { name: "Favorite" });
    expect(icon).not.toHaveAttribute("aria-hidden");
  });

  it("renders correct size", () => {
    const { container } = render(<Icon icon={Heart} size="lg" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("24");
    expect(svg?.getAttribute("height")).toBe("24");
  });

  it("applies custom strokeWidth", () => {
    const { container } = render(<Icon icon={Heart} strokeWidth={1} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("stroke-width")).toBe("1");
  });

  it("applies custom className", () => {
    const { container } = render(<Icon icon={Heart} className="text-red-500" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("text-red-500");
  });
});
