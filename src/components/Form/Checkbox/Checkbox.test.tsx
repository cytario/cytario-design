import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders with label text", () => {
    render(<Checkbox>Accept terms</Checkbox>);
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeDefined();
  });

  it("renders without label", () => {
    render(<Checkbox aria-label="Toggle" />);
    expect(screen.getByRole("checkbox", { name: "Toggle" })).toBeDefined();
  });

  it("toggles on click", async () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>Toggle</Checkbox>);

    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("is checked when defaultSelected", () => {
    render(<Checkbox defaultSelected>Checked</Checkbox>);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("does not toggle when disabled", async () => {
    const onChange = vi.fn();
    render(
      <Checkbox isDisabled onChange={onChange}>
        Disabled
      </Checkbox>,
    );

    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports keyboard activation with Space", async () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>Space</Checkbox>);

    screen.getByRole("checkbox").focus();
    await userEvent.keyboard(" ");
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
