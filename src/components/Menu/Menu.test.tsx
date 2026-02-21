import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Edit, Trash2 } from "lucide-react";
import { Menu } from "./Menu";
import { Button } from "../Button";

describe("Menu", () => {
  const defaultItems = [
    { id: "edit", label: "Edit", icon: Edit },
    { id: "delete", label: "Delete", icon: Trash2, isDanger: true },
  ];

  it("renders the trigger", () => {
    render(
      <Menu items={defaultItems}>
        <Button>Actions</Button>
      </Menu>,
    );
    expect(screen.getByRole("button", { name: "Actions" })).toBeDefined();
  });

  it("opens menu on trigger click", async () => {
    render(
      <Menu items={defaultItems}>
        <Button>Actions</Button>
      </Menu>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menu")).toBeDefined();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeDefined();
    expect(screen.getByRole("menuitem", { name: "Delete" })).toBeDefined();
  });

  it("calls onAction when item is clicked", async () => {
    const onEdit = vi.fn();
    const items = [
      { id: "edit", label: "Edit", onAction: onEdit },
      { id: "delete", label: "Delete" },
    ];

    render(
      <Menu items={items}>
        <Button>Actions</Button>
      </Menu>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("does not show menu items before opening", () => {
    render(
      <Menu items={defaultItems}>
        <Button>Actions</Button>
      </Menu>,
    );
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
