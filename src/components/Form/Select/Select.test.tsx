import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Select } from "./Select";

const items = [
  { id: "1", name: "H&E Stain" },
  { id: "2", name: "IHC Stain" },
  { id: "3", name: "FISH" },
  { id: "4", name: "Special Stain" },
];

describe("Select", () => {
  it("renders with label", () => {
    render(<Select label="Staining Method" items={items} />);
    expect(screen.getByText("Staining Method")).toBeDefined();
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("renders without label", () => {
    render(<Select items={items} />);
    expect(screen.queryByText("Staining Method")).toBeNull();
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("opens popover on click", async () => {
    render(<Select items={items} />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeDefined();
    expect(screen.getByRole("option", { name: "H&E Stain" })).toBeDefined();
    expect(screen.getByRole("option", { name: "FISH" })).toBeDefined();
  });

  it("selects an item", async () => {
    render(<Select items={items} />);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("option", { name: "FISH" }));
    expect(screen.getByRole("button")).toHaveTextContent("FISH");
  });

  it("is disabled when isDisabled is true", () => {
    render(<Select items={items} isDisabled />);
    expect(screen.getByRole("button")).toHaveAttribute("disabled");
  });

  it("uses renderItem for dropdown and trigger", async () => {
    render(
      <Select
        items={items}
        renderItem={(item) => `Custom: ${item.name}`}
      />,
    );

    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Custom: H&E Stain")).toBeDefined();
    expect(screen.getByText("Custom: FISH")).toBeDefined();

    await userEvent.click(screen.getByText("Custom: FISH"));
    expect(screen.getByRole("button")).toHaveTextContent("Custom: FISH");
  });
});
