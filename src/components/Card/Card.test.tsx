import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeDefined();
  });

  it("renders as a div by default", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("renders as an anchor when href is provided", () => {
    const { container } = render(<Card href="/test">Link card</Card>);
    expect(container.firstElementChild?.tagName).toBe("A");
    expect(container.firstElementChild?.getAttribute("href")).toBe("/test");
  });

  it("renders header with border separator", () => {
    render(<Card header={<span>Header</span>}>Body</Card>);
    expect(screen.getByText("Header")).toBeDefined();
    expect(screen.getByText("Body")).toBeDefined();
    const header = screen.getByText("Header").parentElement;
    expect(header?.className).toContain("border-b");
  });

  it("applies cursor-pointer on interactive cards without href", () => {
    const { container } = render(<Card interactive>Click me</Card>);
    expect(container.firstElementChild?.className).toContain("cursor-pointer");
  });

  it("renders footer with border separator", () => {
    const { container } = render(
      <Card footer={<span>Footer</span>}>Body</Card>,
    );
    expect(screen.getByText("Footer")).toBeDefined();
    const footer = screen.getByText("Footer").parentElement;
    expect(footer?.className).toContain("border-t");
  });

  it("applies the correct padding class", () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const body = container.querySelector(".p-6");
    expect(body).not.toBeNull();
  });

  it("applies interactive hover styles", () => {
    const { container } = render(<Card interactive>Hover me</Card>);
    expect(container.firstElementChild?.className).toContain("hover:shadow-md");
  });

  it("does not apply hover styles when not interactive", () => {
    const { container } = render(<Card>Static</Card>);
    expect(container.firstElementChild?.className).not.toContain(
      "hover:shadow-md",
    );
  });

  it("applies custom className", () => {
    const { container } = render(
      <Card className="my-custom">Custom</Card>,
    );
    expect(container.firstElementChild?.className).toContain("my-custom");
  });

  it("renders as role=button when onPress is provided", () => {
    const onPress = vi.fn();
    render(<Card onPress={onPress}>Pressable card</Card>);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("calls onPress on click", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Card onPress={onPress}>Pressable card</Card>);
    await user.click(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledOnce();
  });

  it("calls onPress on Enter key", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Card onPress={onPress}>Pressable card</Card>);
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(onPress).toHaveBeenCalledOnce();
  });

  it("calls onPress on Space key", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Card onPress={onPress}>Pressable card</Card>);
    screen.getByRole("button").focus();
    await user.keyboard(" ");
    expect(onPress).toHaveBeenCalledOnce();
  });

  it("has tabIndex 0 when onPress is provided", () => {
    const onPress = vi.fn();
    render(<Card onPress={onPress}>Pressable card</Card>);
    expect(screen.getByRole("button").getAttribute("tabindex")).toBe("0");
  });
});
