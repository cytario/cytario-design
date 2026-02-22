import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders with label text", () => {
    render(<Switch>Enable</Switch>);
    expect(screen.getByRole("switch", { name: "Enable" })).toBeDefined();
  });

  it("renders without label", () => {
    render(<Switch aria-label="Toggle feature" />);
    expect(screen.getByRole("switch", { name: "Toggle feature" })).toBeDefined();
  });

  it("toggles on click", async () => {
    const onChange = vi.fn();
    render(<Switch onChange={onChange}>Toggle</Switch>);

    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("is selected when defaultSelected", () => {
    render(<Switch defaultSelected>On</Switch>);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("does not toggle when disabled", async () => {
    const onChange = vi.fn();
    render(
      <Switch isDisabled onChange={onChange}>
        Disabled
      </Switch>,
    );

    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports keyboard activation with Space", async () => {
    const onChange = vi.fn();
    render(<Switch onChange={onChange}>Space</Switch>);

    screen.getByRole("switch").focus();
    await userEvent.keyboard(" ");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("applies arbitrary CSS color as inline style when selected", () => {
    const { container } = render(
      <Switch color="#FF0000" defaultSelected>
        Red channel
      </Switch>,
    );

    // The track is the outer div containing the thumb div
    const track = container.querySelector(
      "div[style*='background-color']",
    );
    expect(track).not.toBeNull();
    expect(track?.getAttribute("style")).toContain("background-color");
  });

  it("does not apply inline background-color for preset color", () => {
    const { container } = render(
      <Switch color="primary" defaultSelected>
        Primary
      </Switch>,
    );

    const track = container.querySelector(
      "div[style*='background-color']",
    );
    expect(track).toBeNull();
  });

  it("does not apply arbitrary color inline style when not selected", () => {
    const { container } = render(
      <Switch color="#FF0000">Red channel off</Switch>,
    );

    const track = container.querySelector(
      "div[style*='background-color']",
    );
    expect(track).toBeNull();
  });
});
