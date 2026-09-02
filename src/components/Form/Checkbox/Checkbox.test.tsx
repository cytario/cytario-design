import { fireEvent, render, screen } from "@testing-library/react";
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

  it("does not toggle when clicking a link inside the label", () => {
    const onChange = vi.fn();
    render(
      <Checkbox onChange={onChange}>
        I agree to the{" "}
        <a href="https://example.com/terms">Terms of Use</a>
      </Checkbox>,
    );

    // fireEvent, not userEvent: user-event's click behavior forwards label
    // clicks to the label's control unconditionally, which real browsers skip
    // for interactive targets (links are interactive content per the HTML spec).
    fireEvent.click(screen.getByRole("link", { name: "Terms of Use" }));
    expect(onChange).not.toHaveBeenCalled();
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
