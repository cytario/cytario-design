import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PathPill } from "./PathPill";

describe("PathPill", () => {
  it("renders single segment", () => {
    render(<PathPill>cytario</PathPill>);
    expect(screen.getByText("cytario")).toBeDefined();
  });

  it("shows only last segment by default", () => {
    render(<PathPill>cytario/lab/team</PathPill>);
    expect(screen.getByText("team")).toBeDefined();
    expect(screen.queryByText("cytario")).toBeNull();
    expect(screen.queryByText("lab")).toBeNull();
  });

  it("respects visibleCount", () => {
    render(<PathPill visibleCount={2}>cytario/lab/team</PathPill>);
    expect(screen.getByText("lab")).toBeDefined();
    expect(screen.getByText("team")).toBeDefined();
    expect(screen.queryByText("cytario")).toBeNull();
  });

  it("shows title tooltip when segments are collapsed", () => {
    const { container } = render(<PathPill>cytario/lab/team</PathPill>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute("title", "cytario / lab / team");
  });

  it("hides title when all segments visible", () => {
    const { container } = render(<PathPill>team</PathPill>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).not.toHaveAttribute("title");
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
