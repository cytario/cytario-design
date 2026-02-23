import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl, SegmentedControlItem } from "./SegmentedControl";

function renderControl(props: Record<string, unknown> = {}) {
  return render(
    <SegmentedControl aria-label="Test control" {...props}>
      <SegmentedControlItem id="a">Alpha</SegmentedControlItem>
      <SegmentedControlItem id="b">Beta</SegmentedControlItem>
      <SegmentedControlItem id="c">Charlie</SegmentedControlItem>
    </SegmentedControl>,
  );
}

describe("SegmentedControl", () => {
  it("renders all items as radio buttons", () => {
    renderControl();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("renders the group as a radiogroup", () => {
    renderControl();
    expect(screen.getByRole("radiogroup", { name: "Test control" })).toBeDefined();
  });

  it("selects an item on click", async () => {
    renderControl({ selectionMode: "single" });
    const user = userEvent.setup();

    await user.click(screen.getByRole("radio", { name: "Beta" }));
    expect(screen.getByRole("radio", { name: "Beta" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("supports defaultSelectedKeys", () => {
    renderControl({ defaultSelectedKeys: ["b"] });
    expect(screen.getByRole("radio", { name: "Beta" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("navigates with arrow keys", async () => {
    renderControl({ defaultSelectedKeys: ["a"] });
    const user = userEvent.setup();

    await user.click(screen.getByRole("radio", { name: "Alpha" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Beta" })).toHaveFocus();
  });

  it("does not persist selection in none mode", async () => {
    const onPress = vi.fn();
    render(
      <SegmentedControl selectionMode="none" aria-label="Test control">
        <SegmentedControlItem id="a" onPress={onPress}>
          Alpha
        </SegmentedControlItem>
        <SegmentedControlItem id="b">Beta</SegmentedControlItem>
      </SegmentedControl>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole("radio", { name: "Alpha" }));
    expect(onPress).toHaveBeenCalledTimes(1);
    // Selection should not persist
    expect(screen.getByRole("radio", { name: "Alpha" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("disables all items when isDisabled is set", () => {
    renderControl({ isDisabled: true });
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("disabled");
    }
  });

  it("passes className to the container", () => {
    renderControl({ className: "custom-class" });
    expect(screen.getByRole("radiogroup").className).toContain("custom-class");
  });
});
