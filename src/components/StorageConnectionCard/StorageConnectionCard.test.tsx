import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StorageConnectionCard } from "./StorageConnectionCard";

describe("StorageConnectionCard", () => {
  it("renders name", () => {
    render(<StorageConnectionCard name="my-bucket" />);
    expect(screen.getByText("my-bucket")).toBeDefined();
  });

  it("renders meta content", () => {
    render(
      <StorageConnectionCard name="my-bucket" meta={<span>AWS</span>} />,
    );
    expect(screen.getByText("AWS")).toBeDefined();
  });

  it("hides meta row when meta is not provided", () => {
    const { container } = render(
      <StorageConnectionCard name="my-bucket" status="connected" />,
    );
    // Only the name row should exist, no meta row
    const rows = container.querySelectorAll(".flex.items-center.gap-2");
    expect(rows).toHaveLength(0);
  });

  it("shows status dot for connected", () => {
    const { container } = render(
      <StorageConnectionCard name="test" status="connected" />,
    );
    const dot = container.querySelector("[aria-label='Status: connected']");
    expect(dot).not.toBeNull();
    expect(dot?.className).toContain("--color-status-success");
  });

  it("shows status dot for error", () => {
    const { container } = render(
      <StorageConnectionCard name="test" status="error" />,
    );
    const dot = container.querySelector("[aria-label='Status: error']");
    expect(dot).not.toBeNull();
    expect(dot?.className).toContain("--color-status-danger");
  });

  it("shows status dot for loading", () => {
    const { container } = render(
      <StorageConnectionCard name="test" status="loading" />,
    );
    const dot = container.querySelector("[aria-label='Status: loading']");
    expect(dot).not.toBeNull();
    expect(dot?.className).toContain("--color-status-warning");
  });

  it("hides status dot when status is omitted", () => {
    const { container } = render(
      <StorageConnectionCard name="my-bucket" />,
    );
    const dot = container.querySelector("[aria-label^='Status:']");
    expect(dot).toBeNull();
  });

  it("renders children in preview area", () => {
    render(
      <StorageConnectionCard name="test" status="connected">
        <div data-testid="preview">Preview content</div>
      </StorageConnectionCard>,
    );
    expect(screen.getByTestId("preview")).toBeDefined();
  });

  it("shows error message when status is error", () => {
    render(
      <StorageConnectionCard
        name="test"
        status="error"
        errorMessage="Request failed"
      />,
    );
    expect(screen.getByText("Request failed")).toBeDefined();
  });

  it("shows spinner when status is loading", () => {
    const { container } = render(
      <StorageConnectionCard name="test" status="loading" />,
    );
    const spinner = container.querySelector("svg.animate-spin");
    expect(spinner).not.toBeNull();
  });

  it("info button calls onInfo handler", async () => {
    const user = userEvent.setup();
    const onInfo = vi.fn();
    render(
      <StorageConnectionCard name="test" onInfo={onInfo} />,
    );
    const infoButton = screen.getByRole("button", {
      name: "Connection info",
    });
    await user.click(infoButton);
    expect(onInfo).toHaveBeenCalledOnce();
  });

  it("renders as link when href is provided", () => {
    const { container } = render(
      <StorageConnectionCard name="test" href="/buckets/test" />,
    );
    const link = container.querySelector("a");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("/buckets/test");
  });

  it("renders as div when href is not provided", () => {
    const { container } = render(
      <StorageConnectionCard name="test" />,
    );
    expect(container.querySelector("a")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <StorageConnectionCard name="test" className="my-custom-class" />,
    );
    expect(container.firstElementChild?.className).toContain("my-custom-class");
  });

  it("indents meta row when status is shown", () => {
    const { container } = render(
      <StorageConnectionCard
        name="test"
        status="connected"
        meta={<span>AWS</span>}
      />,
    );
    const metaRow = container.querySelector(".flex.items-center.gap-2");
    expect(metaRow?.className).toContain("pl-4");
  });

  it("does not indent meta row when status is omitted", () => {
    const { container } = render(
      <StorageConnectionCard name="test" meta={<span>AWS</span>} />,
    );
    const metaRow = container.querySelector(".flex.items-center.gap-2");
    expect(metaRow?.className).not.toContain("pl-4");
  });
});
