import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { MultiSelectComboBox } from "./MultiSelectComboBox";

const items = [
  { id: "g1", name: "customers/vericura" },
  { id: "g2", name: "customers/acme" },
];

function getSelectedTagKeys(): string[] {
  const tagGroup = screen.queryByRole("grid", {
    name: "Groups selected",
    hidden: true,
  });
  if (!tagGroup) return [];
  return within(tagGroup)
    .queryAllByRole("row", { hidden: true })
    .map((el) => el.dataset.key ?? "");
}

describe("MultiSelectComboBox", () => {
  test("renders a labelled combobox whose listbox options carry the item names", async () => {
    const user = userEvent.setup();
    render(<MultiSelectComboBox label="Groups" items={items} />);

    expect(
      screen.getByRole("combobox", { name: "Groups" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("combobox", { name: "Groups" }));
    await user.keyboard("[ArrowDown]");
    const listbox = await screen.findByRole("listbox");
    expect(
      within(listbox).getByRole("option", { name: "customers/vericura" }),
    ).toBeInTheDocument();
    expect(
      within(listbox).getByRole("option", { name: "customers/acme" }),
    ).toBeInTheDocument();
  });

  test("clicking the chevron button opens the options without typing", async () => {
    const user = userEvent.setup();
    render(<MultiSelectComboBox label="Groups" items={items} />);

    await user.click(screen.getByRole("button", { name: /Groups/ }));
    const listbox = await screen.findByRole("listbox");
    expect(within(listbox).getAllByRole("option")).toHaveLength(2);
  });

  test("typing filters the options", async () => {
    const user = userEvent.setup();
    render(<MultiSelectComboBox label="Groups" items={items} />);

    await user.type(screen.getByRole("combobox", { name: "Groups" }), "acm");
    const listbox = await screen.findByRole("listbox");
    expect(
      within(listbox)
        .getAllByRole("option")
        .map((option) => option.textContent),
    ).toEqual(["customers/acme"]);
  });

  test("selecting options reports the growing value list and shows tags", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <MultiSelectComboBox label="Groups" items={items} onChange={onChange} />,
    );

    const input = screen.getByRole("combobox", { name: "Groups" });
    await user.click(input);
    await user.keyboard("[ArrowDown]");
    const listbox = screen.getByRole("listbox");

    await user.click(
      within(listbox).getByRole("option", { name: "customers/vericura" }),
    );
    expect(onChange).toHaveBeenLastCalledWith(["g1"]);
    await waitFor(() => {
      expect(getSelectedTagKeys()).toEqual(["g1"]);
    });

    await user.click(
      within(listbox).getByRole("option", { name: "customers/acme" }),
    );
    expect(onChange).toHaveBeenLastCalledWith(["g1", "g2"]);
    await waitFor(() => {
      expect(getSelectedTagKeys()).toEqual(["g1", "g2"]);
    });
  });

  test("selected options show a check mark", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelectComboBox
        label="Groups"
        items={items}
        defaultValue={["g2"]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Groups/ }));
    const listbox = await screen.findByRole("listbox");
    const selected = within(listbox).getByRole("option", {
      name: "customers/acme",
    });
    const unselected = within(listbox).getByRole("option", {
      name: "customers/vericura",
    });
    expect(selected).toHaveAttribute("aria-selected", "true");
    expect(selected.querySelector("svg")).not.toBeNull();
    expect(unselected.querySelector("svg")).toBeNull();
  });

  test("a tag's remove button deselects its item", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelectComboBox
        label="Groups"
        items={items}
        defaultValue={["g1", "g2"]}
        onChange={onChange}
      />,
    );

    const tag = await screen.findByRole("row", { name: "customers/vericura" });
    await user.click(within(tag).getByRole("button"));
    expect(onChange).toHaveBeenLastCalledWith(["g2"]);
    await waitFor(() => {
      expect(getSelectedTagKeys()).toEqual(["g2"]);
    });
  });

  test("controlled value renders the selected items as tags", async () => {
    render(<MultiSelectComboBox label="Groups" items={items} value={["g2"]} />);

    await waitFor(() => {
      expect(getSelectedTagKeys()).toEqual(["g2"]);
    });
  });
});
