import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup, Radio, RadioButton } from "./Radio";

describe("RadioGroup", () => {
  it("renders radio options", () => {
    render(
      <RadioGroup aria-label="Options">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>,
    );

    expect(screen.getByRole("radio", { name: "Option A" })).toBeDefined();
    expect(screen.getByRole("radio", { name: "Option B" })).toBeDefined();
  });

  it("selects a radio on click", async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup aria-label="Options" onChange={onChange}>
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>,
    );

    await userEvent.click(screen.getByRole("radio", { name: "Option B" }));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("has default value selected", () => {
    render(
      <RadioGroup aria-label="Options" defaultValue="b">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>,
    );

    expect(screen.getByRole("radio", { name: "Option B" })).toBeChecked();
  });

  it("disables all radios when group is disabled", () => {
    render(
      <RadioGroup aria-label="Options" isDisabled>
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>,
    );

    expect(screen.getByRole("radio", { name: "Option A" })).toHaveAttribute("disabled");
    expect(screen.getByRole("radio", { name: "Option B" })).toHaveAttribute("disabled");
  });

  it("supports keyboard navigation", async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup aria-label="Options" onChange={onChange}>
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>,
    );

    await userEvent.click(screen.getByRole("radio", { name: "Option A" }));
    await userEvent.keyboard("{ArrowDown}");
    expect(onChange).toHaveBeenCalledWith("b");
  });
});

describe("RadioButton", () => {
  it("renders button-style radios", () => {
    render(
      <RadioGroup aria-label="View">
        <RadioButton value="grid">Grid</RadioButton>
        <RadioButton value="list">List</RadioButton>
      </RadioGroup>,
    );

    expect(screen.getByRole("radio", { name: "Grid" })).toBeDefined();
    expect(screen.getByRole("radio", { name: "List" })).toBeDefined();
  });

  it("selects button radio on click", async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup aria-label="View" onChange={onChange}>
        <RadioButton value="grid">Grid</RadioButton>
        <RadioButton value="list">List</RadioButton>
      </RadioGroup>,
    );

    await userEvent.click(screen.getByRole("radio", { name: "List" }));
    expect(onChange).toHaveBeenCalledWith("list");
  });
});
