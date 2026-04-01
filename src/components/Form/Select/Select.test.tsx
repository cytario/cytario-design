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

  it("opens popover on click", async () => {
    render(<Select label="Staining Method" items={items} />);

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("listbox")).toBeDefined();
    expect(screen.getByRole("option", { name: "H&E Stain" })).toBeDefined();
    expect(screen.getByRole("option", { name: "FISH" })).toBeDefined();
  });

  it("selects an item", async () => {
    render(<Select label="Staining Method" items={items} />);

    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("option", { name: "FISH" }));

    expect(screen.getByRole("button")).toHaveTextContent("FISH");
  });

  it("shows error message", () => {
    render(
      <Select
        label="Staining Method"
        items={items}
        errorMessage="Required field"
      />,
    );

    const matches = screen.getAllByText("Required field");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("is disabled when isDisabled is true", () => {
    render(<Select label="Staining Method" items={items} isDisabled />);

    expect(screen.getByRole("button")).toHaveAttribute("disabled");
  });

  it("visually hides label when hideLabel is true", () => {
    render(<Select label="Staining Method" items={items} hideLabel />);
    const label = screen.getByText("Staining Method");
    expect(label.className).toContain("sr-only");
  });
});
