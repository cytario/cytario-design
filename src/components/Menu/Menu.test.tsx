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

  it("renders menu item with href as a link", async () => {
    const items = [
      {
        id: "link",
        label: "Open Keycloak",
        href: "https://keycloak.example.com",
      },
    ];

    render(
      <Menu items={items}>
        <Button>Actions</Button>
      </Menu>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    const menuItem = screen.getByRole("menuitem", { name: "Open Keycloak" });
    expect(menuItem.tagName).toBe("A");
    expect(menuItem.getAttribute("href")).toBe(
      "https://keycloak.example.com",
    );
  });

  it("sets target attribute on menu item with href and target", async () => {
    const items = [
      {
        id: "link",
        label: "External Link",
        href: "https://example.com",
        target: "_blank",
      },
    ];

    render(
      <Menu items={items}>
        <Button>Actions</Button>
      </Menu>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    const menuItem = screen.getByRole("menuitem", { name: "External Link" });
    expect(menuItem.getAttribute("target")).toBe("_blank");
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
