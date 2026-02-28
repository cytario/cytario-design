import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StorageConnectionCard } from "./StorageConnectionCard";

describe("StorageConnectionCard", () => {
  it("renders card with name and provider", () => {
    render(
      <StorageConnectionCard
        name="my-bucket"
        provider="aws"
        status="connected"
      />,
    );
    expect(screen.getByText("my-bucket")).toBeDefined();
    expect(screen.getByText("AWS")).toBeDefined();
  });

  it("shows status indicator with correct class for connected", () => {
    const { container } = render(
      <StorageConnectionCard
        name="test"
        provider="aws"
        status="connected"
      />,
    );
    const dot = container.querySelector("[aria-label='Status: connected']");
    expect(dot).not.toBeNull();
    expect(dot?.className).toContain("--color-status-success");
  });

  it("shows status indicator with correct class for error", () => {
    const { container } = render(
      <StorageConnectionCard
        name="test"
        provider="aws"
        status="error"
      />,
    );
    const dot = container.querySelector("[aria-label='Status: error']");
    expect(dot).not.toBeNull();
    expect(dot?.className).toContain("--color-status-danger");
  });

  it("shows status indicator with correct class for loading", () => {
    const { container } = render(
      <StorageConnectionCard
        name="test"
        provider="aws"
        status="loading"
      />,
    );
    const dot = container.querySelector("[aria-label='Status: loading']");
    expect(dot).not.toBeNull();
    expect(dot?.className).toContain("--color-status-warning");
  });

  it("renders children in preview area", () => {
    render(
      <StorageConnectionCard
        name="test"
        provider="aws"
        status="connected"
      >
        <div data-testid="preview">Preview content</div>
      </StorageConnectionCard>,
    );
    expect(screen.getByTestId("preview")).toBeDefined();
  });

  it("shows error message when status is error", () => {
    render(
      <StorageConnectionCard
        name="test"
        provider="aws"
        status="error"
        errorMessage="Request failed"
      />,
    );
    expect(screen.getByText("Request failed")).toBeDefined();
  });

  it("shows spinner when status is loading", () => {
    const { container } = render(
      <StorageConnectionCard
        name="test"
        provider="aws"
        status="loading"
      />,
    );
    const spinner = container.querySelector("svg.animate-spin");
    expect(spinner).not.toBeNull();
  });

  it("info button calls onInfo handler", async () => {
    const user = userEvent.setup();
    const onInfo = vi.fn();
    render(
      <StorageConnectionCard
        name="test"
        provider="aws"
        status="connected"
        onInfo={onInfo}
      />,
    );
    const infoButton = screen.getByRole("button", {
      name: "Connection info",
    });
    await user.click(infoButton);
    expect(onInfo).toHaveBeenCalledOnce();
  });

  it("card is clickable when href is provided", () => {
    const { container } = render(
      <StorageConnectionCard
        name="test"
        provider="aws"
        status="connected"
        href="/buckets/aws/test"
      />,
    );
    const link = container.querySelector("a");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("/buckets/aws/test");
  });

  it("renders as div when href is not provided", () => {
    const { container } = render(
      <StorageConnectionCard
        name="test"
        provider="aws"
        status="connected"
      />,
    );
    const link = container.querySelector("a");
    expect(link).toBeNull();
  });

  it("shows region when provided", () => {
    render(
      <StorageConnectionCard
        name="test"
        provider="aws"
        region="eu-central-1"
        status="connected"
      />,
    );
    expect(screen.getByText("eu-central-1")).toBeDefined();
  });

  it("shows image count when provided", () => {
    render(
      <StorageConnectionCard
        name="test"
        provider="aws"
        status="connected"
        imageCount={42}
      />,
    );
    expect(screen.getByText("42 images")).toBeDefined();
  });

  it("applies custom className", () => {
    const { container } = render(
      <StorageConnectionCard
        name="test"
        provider="aws"
        status="connected"
        className="my-custom-class"
      />,
    );
    expect(container.firstElementChild?.className).toContain("my-custom-class");
  });

  it("renders unknown provider name as-is", () => {
    render(
      <StorageConnectionCard
        name="test"
        provider="wasabi"
        status="connected"
      />,
    );
    expect(screen.getByText("wasabi")).toBeDefined();
  });

  it("renders without provider — no badge or region shown", () => {
    render(
      <StorageConnectionCard
        name="my-bucket"
        status="connected"
        region="eu-central-1"
      />,
    );
    expect(screen.getByText("my-bucket")).toBeDefined();
    expect(screen.queryByText("eu-central-1")).toBeNull();
  });

  it("renders without status — no status dot shown", () => {
    const { container } = render(
      <StorageConnectionCard
        name="my-bucket"
        provider="aws"
      />,
    );
    expect(screen.getByText("my-bucket")).toBeDefined();
    expect(screen.getByText("AWS")).toBeDefined();
    const dot = container.querySelector("[aria-label^='Status:']");
    expect(dot).toBeNull();
  });

  it("renders without provider or status — minimal card", () => {
    const { container } = render(
      <StorageConnectionCard name="my-bucket" />,
    );
    expect(screen.getByText("my-bucket")).toBeDefined();
    const dot = container.querySelector("[aria-label^='Status:']");
    expect(dot).toBeNull();
  });

  it("renders without status — bottom row has no left indent", () => {
    const { container } = render(
      <StorageConnectionCard
        name="my-bucket"
        provider="aws"
      />,
    );
    const bottomRow = container.querySelector(".flex.items-center.gap-2");
    expect(bottomRow).not.toBeNull();
    expect(bottomRow?.className).not.toContain("pl-4");
  });

  it("renders without status — preview area shows connected state", () => {
    render(
      <StorageConnectionCard name="my-bucket">
        <div data-testid="preview">Content</div>
      </StorageConnectionCard>,
    );
    expect(screen.getByTestId("preview")).toBeDefined();
  });

  it("shows image count without status (defaults to connected behavior)", () => {
    render(
      <StorageConnectionCard
        name="my-bucket"
        imageCount={10}
      />,
    );
    expect(screen.getByText("10 images")).toBeDefined();
  });
});
