import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Banner } from "./Banner";

describe("Banner", () => {
  it("renders children content", () => {
    render(<Banner>Test message</Banner>);
    expect(screen.getByText("Test message")).toBeDefined();
  });

  it("renders title when provided", () => {
    render(<Banner title="Warning">Content</Banner>);
    expect(screen.getByText(/Warning/)).toBeDefined();
  });

  it("renders with role=status for info variant", () => {
    render(<Banner variant="info">Info</Banner>);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("renders with role=status for success variant", () => {
    render(<Banner variant="success">Success</Banner>);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("renders with role=alert for warning variant", () => {
    render(<Banner variant="warning">Warning</Banner>);
    expect(screen.getByRole("alert")).toBeDefined();
  });

  it("renders with role=alert for danger variant", () => {
    render(<Banner variant="danger">Danger</Banner>);
    expect(screen.getByRole("alert")).toBeDefined();
  });

  it("renders icon as aria-hidden", () => {
    const { container } = render(<Banner>Content</Banner>);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not show dismiss button by default", () => {
    render(<Banner>Content</Banner>);
    expect(screen.queryByRole("button", { name: "Dismiss" })).toBeNull();
  });

  it("shows dismiss button when dismissible", () => {
    render(<Banner dismissible>Content</Banner>);
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeDefined();
  });

  it("removes banner on dismiss", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Banner dismissible onDismiss={onDismiss}>
        Dismiss me
      </Banner>,
    );

    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Dismiss me")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Banner className="my-custom">Content</Banner>,
    );
    expect(container.firstElementChild?.className).toContain("my-custom");
  });
});
