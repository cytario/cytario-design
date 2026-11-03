import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import { Dialog } from "../../Dialog";
import { MultiSelectComboBox } from "./MultiSelectComboBox";

const items = [
  { id: "g1", name: "customers/vericura" },
  { id: "g2", name: "customers/acme" },
];

describe("MultiSelectComboBox inside a Dialog", () => {
  test("selecting an option and closing the listbox keeps the dialog actionable", async () => {
    const user = userEvent.setup();
    render(
      <Dialog isOpen onOpenChange={() => {}} title="Invite User">
        <button type="submit">Send Invite</button>
        <MultiSelectComboBox label="Groups" items={items} />
      </Dialog>,
    );

    const input = screen.getByRole("combobox", { name: "Groups" });
    await user.click(input);
    await user.keyboard("[ArrowDown]");
    const listbox = screen.getByRole("listbox");
    await user.click(within(listbox).getByRole("option", { name: "customers/vericura" }));

    // A user closes the open listbox (Escape) before moving to the footer;
    // the dialog itself must stay open with the selection applied.
    await user.keyboard("[Escape]");

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    const sendButton = within(dialog).getByRole("button", { name: "Send Invite" });
    expect(sendButton).toBeVisible();

    await waitFor(() => {
      const tag = screen
        .getAllByText("customers/vericura", { exact: true })
        .find((el) => el.closest(".react-aria-Tag") !== null);
      expect(tag).toBeDefined();
    });
  });
});
