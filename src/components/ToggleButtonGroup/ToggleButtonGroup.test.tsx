import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToggleButtonGroup, ToggleButtonGroupItem } from "./ToggleButtonGroup";

function renderGroup(props: Record<string, unknown> = {}) {
  return render(
    <ToggleButtonGroup aria-label="Test group" defaultValue="a" {...props}>
      <ToggleButtonGroupItem value="a">Alpha</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="b">Beta</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="c">Charlie</ToggleButtonGroupItem>
    </ToggleButtonGroup>,
  );
}

describe("ToggleButtonGroup", () => {
  it("renders as a radiogroup", () => {
    renderGroup();
    expect(screen.getByRole("radiogroup", { name: "Test group" })).toBeDefined();
  });

  it("renders items as radio options", () => {
    renderGroup();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("selects default value", () => {
    renderGroup({ defaultValue: "b" });
    expect(screen.getByRole("radio", { name: "Beta" })).toBeChecked();
  });

  it("changes selection on click", async () => {
    const onChange = vi.fn();
    renderGroup({ onChange });

    await userEvent.click(screen.getByRole("radio", { name: "Beta" }));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("navigates with arrow keys", async () => {
    renderGroup({ defaultValue: "a" });

    await userEvent.click(screen.getByRole("radio", { name: "Alpha" }));
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Beta" })).toHaveFocus();
  });

  it("disables all items when isDisabled is set", () => {
    renderGroup({ isDisabled: true });
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("disabled");
    }
  });

  it("supports controlled value", async () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <ToggleButtonGroup aria-label="Test group" value="a" onChange={onChange}>
        <ToggleButtonGroupItem value="a">Alpha</ToggleButtonGroupItem>
        <ToggleButtonGroupItem value="b">Beta</ToggleButtonGroupItem>
      </ToggleButtonGroup>,
    );

    await userEvent.click(screen.getByRole("radio", { name: "Beta" }));
    expect(onChange).toHaveBeenCalledWith("b");

    rerender(
      <ToggleButtonGroup aria-label="Test group" value="b" onChange={onChange}>
        <ToggleButtonGroupItem value="a">Alpha</ToggleButtonGroupItem>
        <ToggleButtonGroupItem value="b">Beta</ToggleButtonGroupItem>
      </ToggleButtonGroup>,
    );

    expect(screen.getByRole("radio", { name: "Beta" })).toBeChecked();
  });

  it("passes className to the container", () => {
    renderGroup({ className: "custom-class" });
    expect(screen.getByRole("radiogroup").className).toContain("custom-class");
  });
});
