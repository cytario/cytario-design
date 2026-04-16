import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PathPill } from "./PathPill";

describe("PathPill", () => {
  it("renders single segment", () => {
    render(<PathPill>cytario</PathPill>);
    expect(screen.getByText("cytario")).toBeDefined();
  });

  it("shows all segments by default", () => {
    render(<PathPill>cytario/lab/team</PathPill>);
    expect(screen.getByText("cytario")).toBeDefined();
    expect(screen.getByText("lab")).toBeDefined();
    expect(screen.getByText("team")).toBeDefined();
  });

  it("collapses segments with visibleCount", () => {
    render(<PathPill visibleCount={1}>cytario/lab/team</PathPill>);
    expect(screen.getByText("team")).toBeDefined();
    expect(screen.queryByText("cytario")).toBeNull();
    expect(screen.queryByText("lab")).toBeNull();
  });

  it("respects visibleCount={2}", () => {
    render(<PathPill visibleCount={2}>cytario/lab/team</PathPill>);
    expect(screen.getByText("lab")).toBeDefined();
    expect(screen.getByText("team")).toBeDefined();
    expect(screen.queryByText("cytario")).toBeNull();
  });

  it("marks collapsed segments as aria-hidden", () => {
    const { container } = render(
      <PathPill visibleCount={1}>cytario/lab/team</PathPill>,
    );
    const hidden = container.querySelectorAll("[aria-hidden='true']");
    // "cytario" and "lab" are collapsed
    expect(hidden).toHaveLength(2);
  });

  it("no aria-hidden when all segments visible", () => {
    const { container } = render(<PathPill>cytario/lab/team</PathPill>);
    const hidden = container.querySelectorAll("[aria-hidden='true']");
    expect(hidden).toHaveLength(0);
  });

  it("has aria-label with full path", () => {
    render(<PathPill>/org/team/admins</PathPill>);
    expect(screen.getByLabelText("Path: org / team / admins")).toBeDefined();
  });

  it("returns null for empty string", () => {
    const { container } = render(<PathPill>{""}</PathPill>);
    expect(container.firstChild).toBeNull();
  });
});
