import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Pill, pillColorFromName } from "./Pill";

describe("pillColorFromName", () => {
  it("returns a deterministic color for a given string", () => {
    const first = pillColorFromName("test");
    const second = pillColorFromName("test");
    expect(first).toBe(second);
  });

  it("returns different colors for different strings", () => {
    const a = pillColorFromName("science");
    const b = pillColorFromName("engineering");
    expect(a).not.toBe(b);
  });
});

describe("Pill", () => {
  it("renders children text", () => {
    render(<Pill>CSV</Pill>);
    expect(screen.getByText("CSV")).toBeDefined();
  });

  it("merges custom className", () => {
    render(<Pill className="ml-2">Tag</Pill>);
    const el = screen.getByText("Tag");
    expect(el.className).toContain("ml-2");
  });
});
