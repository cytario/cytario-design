import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { IconButtonToggle } from "./IconButton";

describe("IconButtonToggle", () => {
  it("exposes aria-pressed and toggles it on click", async () => {
    render(
      <IconButtonToggle icon="PanelLeftClose" label="Toggle panel" defaultSelected={false} />,
    );
    const button = screen.getByRole("button", { name: "Toggle panel" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("applies the selected background when selected", () => {
    render(
      <IconButtonToggle icon="PanelLeftClose" label="Toggle panel" defaultSelected isSelected />,
    );
    const button = screen.getByRole("button", { name: "Toggle panel" });
    expect(button).toHaveAttribute("data-selected");
    expect(button.className).toContain("selected:bg-accent-pressed");
  });
});
