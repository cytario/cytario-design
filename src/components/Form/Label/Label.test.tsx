import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./Label";

describe("Label", () => {
  it("renders label text", () => {
    render(<Label>Patient name</Label>);
    expect(screen.getByText("Patient name")).toBeDefined();
  });

  it("shows required indicator", () => {
    render(<Label isRequired>Email</Label>);
    expect(screen.getByText("*")).toBeDefined();
  });

  it("does not show required indicator by default", () => {
    render(<Label>Optional field</Label>);
    expect(screen.queryByText("*")).toBeNull();
  });

  it("marks the asterisk as aria-hidden", () => {
    render(<Label isRequired>Email</Label>);
    const asterisk = screen.getByText("*");
    expect(asterisk.getAttribute("aria-hidden")).toBe("true");
  });
});
