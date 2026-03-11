import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Settings, Trash2, X } from "lucide-react";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("renders with correct aria-label", () => {
    render(<IconButton icon={Settings} aria-label="Settings" showTooltip={false} />);
    expect(screen.getByRole("button", { name: "Settings" })).toBeDefined();
  });

  it("calls onPress when clicked", async () => {
    const onPress = vi.fn();
    render(
      <IconButton icon={X} aria-label="Close" onPress={onPress} showTooltip={false} />,
    );

    await userEvent.click(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", async () => {
    const onPress = vi.fn();
    render(
      <IconButton
        icon={Settings}
        aria-label="Settings"
        onPress={onPress}
        isDisabled
        showTooltip={false}
      />,
    );

    await userEvent.click(screen.getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("shows loading spinner and disables interaction", async () => {
    const onPress = vi.fn();
    render(
      <IconButton
        icon={Settings}
        aria-label="Settings"
        onPress={onPress}
        isLoading
        showTooltip={false}
      />,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("disabled");

    // SVG spinner should be present (not the icon)
    const svg = button.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.classList.contains("animate-spin")).toBe(true);

    await userEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("renders icon as decorative (aria-hidden)", () => {
    const { container } = render(
      <IconButton icon={Settings} aria-label="Settings" showTooltip={false} />,
    );

    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("supports keyboard activation with Enter", async () => {
    const onPress = vi.fn();
    render(
      <IconButton icon={X} aria-label="Close" onPress={onPress} showTooltip={false} />,
    );

    screen.getByRole("button").focus();
    await userEvent.keyboard("{Enter}");
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard activation with Space", async () => {
    const onPress = vi.fn();
    render(
      <IconButton icon={X} aria-label="Close" onPress={onPress} showTooltip={false} />,
    );

    screen.getByRole("button").focus();
    await userEvent.keyboard(" ");
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("applies variant styles", () => {
    render(
      <IconButton
        icon={Trash2}
        aria-label="Delete"
        variant="destructive"
        showTooltip={false}
      />,
    );

    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-(--color-action-danger)");
  });

  it("applies size styles", () => {
    render(
      <IconButton icon={Settings} aria-label="Settings" size="lg" showTooltip={false} />,
    );

    const button = screen.getByRole("button");
    expect(button.className).toContain("h-12");
    expect(button.className).toContain("w-12");
  });
});
