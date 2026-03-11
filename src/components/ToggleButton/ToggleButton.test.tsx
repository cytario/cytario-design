import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToggleButton } from "./ToggleButton";

describe("ToggleButton", () => {
  it("renders with correct text", () => {
    render(<ToggleButton>Toggle</ToggleButton>);
    expect(screen.getByRole("button", { name: "Toggle" })).toBeDefined();
  });

  it("has aria-pressed=false by default", () => {
    render(<ToggleButton>Toggle</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("toggles aria-pressed on click", async () => {
    render(<ToggleButton>Toggle</ToggleButton>);
    const button = screen.getByRole("button");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("respects defaultSelected", () => {
    render(<ToggleButton defaultSelected>On</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("calls onChange when toggled", async () => {
    const onChange = vi.fn();
    render(<ToggleButton onChange={onChange}>Toggle</ToggleButton>);

    await userEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenCalledWith(true);

    await userEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("does not toggle when disabled", async () => {
    render(<ToggleButton isDisabled>Disabled</ToggleButton>);
    const button = screen.getByRole("button");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("renders outlined variant with border", () => {
    render(<ToggleButton variant="outlined">Outlined</ToggleButton>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("border");
    expect(button.className).toContain("bg-(--color-surface-default)");
  });

  it("applies square dimensions when isSquare is true", () => {
    render(
      <ToggleButton isSquare size="md">
        Sq
      </ToggleButton>,
    );
    const button = screen.getByRole("button");
    expect(button.className).toContain("h-8");
    expect(button.className).toContain("w-8");
    expect(button.className).toContain("rounded-none");
  });

  it("applies small square dimensions", () => {
    render(
      <ToggleButton isSquare size="sm">
        S
      </ToggleButton>,
    );
    const button = screen.getByRole("button");
    expect(button.className).toContain("h-7");
    expect(button.className).toContain("w-7");
  });

  it("applies large square dimensions", () => {
    render(
      <ToggleButton isSquare size="lg">
        L
      </ToggleButton>,
    );
    const button = screen.getByRole("button");
    expect(button.className).toContain("h-10");
    expect(button.className).toContain("w-10");
  });
});
