import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { MultiSelectComboBox } from "./MultiSelectComboBox";

const items = [
  { id: "g1", name: "customers/vericura" },
  { id: "g2", name: "customers/acme" },
];

/** Tags render with a data-key attribute; text queries ignore aria-hidden. */
function getSelectedTagKeys(): string[] {
  return screen
    .queryAllByText(/customers\//)
    .map((el) => el.closest<HTMLElement>(".react-aria-Tag"))
    .filter((el): el is HTMLElement => el !== null)
    .map((el) => el.dataset.key ?? "");
}

describe("MultiSelectComboBox", () => {
  test("renders a labelled combobox whose listbox options carry the item names", async () => {
    const user = userEvent.setup();
    render(<MultiSelectComboBox label="Groups" items={items} />);

    expect(screen.getByRole("combobox", { name: "Groups" })).toBeInTheDocument();

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

  test("selecting options reports the growing value list and shows tags", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<MultiSelectComboBox label="Groups" items={items} onChange={onChange} />);

    const input = screen.getByRole("combobox", { name: "Groups" });
    await user.click(input);
    await user.keyboard("[ArrowDown]");
    const listbox = screen.getByRole("listbox");

    await user.click(within(listbox).getByRole("option", { name: "customers/vericura" }));
    expect(onChange).toHaveBeenLastCalledWith(["g1"]);
    await waitFor(() => {
      expect(getSelectedTagKeys()).toEqual(["g1"]);
    });

    await user.click(within(listbox).getByRole("option", { name: "customers/acme" }));
    expect(onChange).toHaveBeenLastCalledWith(["g1", "g2"]);
    await waitFor(() => {
      expect(getSelectedTagKeys()).toEqual(["g1", "g2"]);
    });
  });

  test("controlled value renders the selected items as tags", async () => {
    render(<MultiSelectComboBox label="Groups" items={items} value={["g2"]} />);

    await waitFor(() => {
      expect(getSelectedTagKeys()).toEqual(["g2"]);
    });
  });
});
