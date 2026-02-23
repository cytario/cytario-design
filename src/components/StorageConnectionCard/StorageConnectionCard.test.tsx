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
    expect(dot?.className).toContain("bg-emerald-500");
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
    expect(dot?.className).toContain("bg-red-500");
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
    expect(dot?.className).toContain("bg-amber-500");
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
});
