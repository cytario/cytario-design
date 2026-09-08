import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "./Slider";

describe("Slider", () => {
  it("renders with label", () => {
    render(<Slider label="Memory" defaultValue={32} minValue={8} maxValue={256} />);
    expect(screen.getByText("Memory")).toBeDefined();
  });

  it("renders the formatted output for the current value", () => {
    render(
      <Slider
        label="Memory"
        defaultValue={32}
        minValue={8}
        maxValue={256}
        output={(v) => `${v} GiB`}
      />,
    );
    expect(screen.getByText("32 GiB")).toBeDefined();
  });

  it("renders description text below the track", () => {
    render(
      <Slider
        label="Memory"
        defaultValue={32}
        minValue={8}
        maxValue={256}
        description="provider max 256 GiB"
      />,
    );
    expect(screen.getByText("provider max 256 GiB")).toBeDefined();
  });

  it("renders the error message in place of the description when invalid", () => {
    render(
      <Slider
        label="Memory"
        defaultValue={32}
        minValue={8}
        maxValue={256}
        description="provider max 256 GiB"
        errorMessage="Below the application floor"
      />,
    );
    expect(screen.getByText("Below the application floor")).toBeDefined();
    expect(screen.queryByText("provider max 256 GiB")).toBeNull();
  });

  it("calls onChange when the thumb is moved with the keyboard", async () => {
    const onChange = vi.fn();
    render(
      <Slider
        label="Memory"
        defaultValue={32}
        minValue={8}
        maxValue={256}
        step={4}
        onChange={onChange}
      />,
    );
    const slider = screen.getByRole("slider");
    slider.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith(36);
  });

  it("exposes the slider role with min/max/now values", () => {
    render(<Slider label="Memory" defaultValue={32} minValue={8} maxValue={256} />);
    // react-aria renders the native range input inside the thumb.
    const slider = screen.getByRole("slider", { hidden: true });
    expect(slider).toHaveAttribute("min", "8");
    expect(slider).toHaveAttribute("max", "256");
    expect(slider).toHaveAttribute("value", "32");
  });
});
