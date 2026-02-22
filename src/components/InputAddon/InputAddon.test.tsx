import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InputAddon } from "./InputAddon";

describe("InputAddon", () => {
  it("renders text content", () => {
    render(<InputAddon>https://</InputAddon>);
    expect(screen.getByText("https://")).toBeDefined();
  });

  it("applies muted background class", () => {
    const { container } = render(<InputAddon>$</InputAddon>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("bg-[var(--color-surface-subtle)]");
  });

  it("is not focusable or interactive", () => {
    const { container } = render(<InputAddon>.kg</InputAddon>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el.getAttribute("tabindex")).toBeNull();
    expect(el.getAttribute("role")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <InputAddon className="extra-class">$</InputAddon>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("extra-class");
  });
});
