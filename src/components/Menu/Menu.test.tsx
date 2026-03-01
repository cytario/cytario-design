import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Edit, Settings, Trash2 } from "lucide-react";
import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import { MenuSection } from "./MenuSection";
import { MenuHeader } from "./MenuHeader";
import { MenuSeparator } from "./MenuSeparator";
import { Button } from "../Button";

// ─── Data-driven (items prop) ────────────────────────────────────────────────

describe("Menu (items prop)", () => {
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

  it("renders endContent in items prop mode", async () => {
    const items = [
      {
        id: "edit",
        label: "Edit",
        endContent: <span data-testid="shortcut">Cmd+E</span>,
      },
    ];

    render(
      <Menu items={items}>
        <Button>Actions</Button>
      </Menu>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByTestId("shortcut")).toBeDefined();
  });
});

// ─── Composition API (content prop) ──────────────────────────────────────────

describe("Menu (composition API)", () => {
  it("renders menu items via content prop", async () => {
    render(
      <Menu
        content={
          <>
            <MenuItem id="settings" icon={Settings}>
              Settings
            </MenuItem>
            <MenuItem id="edit" icon={Edit}>
              Edit
            </MenuItem>
          </>
        }
      >
        <Button>Actions</Button>
      </Menu>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menu")).toBeDefined();
    expect(screen.getByRole("menuitem", { name: "Settings" })).toBeDefined();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeDefined();
  });

  it("renders sections with headers", async () => {
    render(
      <Menu
        content={
          <>
            <MenuSection header="File">
              <MenuItem id="edit" icon={Edit}>
                Edit
              </MenuItem>
            </MenuSection>
            <MenuSection header="Danger">
              <MenuItem id="delete" icon={Trash2} isDanger>
                Delete
              </MenuItem>
            </MenuSection>
          </>
        }
      >
        <Button>Actions</Button>
      </Menu>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByText("File")).toBeDefined();
    expect(screen.getByText("Danger")).toBeDefined();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeDefined();
    expect(screen.getByRole("menuitem", { name: "Delete" })).toBeDefined();
  });

  it("renders separators", async () => {
    render(
      <Menu
        content={
          <>
            <MenuItem id="edit">Edit</MenuItem>
            <MenuSeparator />
            <MenuItem id="delete" isDanger>
              Delete
            </MenuItem>
          </>
        }
      >
        <Button>Actions</Button>
      </Menu>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("renders custom header content via MenuHeader", async () => {
    render(
      <Menu
        content={
          <>
            <MenuSection>
              <MenuHeader>
                <div data-testid="user-info">Dr. Sarah Chen</div>
              </MenuHeader>
            </MenuSection>
            <MenuItem id="logout">Log out</MenuItem>
          </>
        }
      >
        <Button>Actions</Button>
      </Menu>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByTestId("user-info")).toBeDefined();
    expect(screen.getByText("Dr. Sarah Chen")).toBeDefined();
  });

  it("renders endContent in MenuItem", async () => {
    render(
      <Menu
        content={
          <MenuItem
            id="export"
            textValue="Export"
            endContent={<span data-testid="badge">New</span>}
          >
            Export
          </MenuItem>
        }
      >
        <Button>Actions</Button>
      </Menu>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByTestId("badge")).toBeDefined();
    // The menuitem contains both "Export" and "New" text, so the accessible name includes both
    expect(screen.getByRole("menuitem")).toBeDefined();
    expect(screen.getByText("Export")).toBeDefined();
  });

  it("calls onAction on MenuItem", async () => {
    const onAction = vi.fn();

    render(
      <Menu
        content={
          <MenuItem id="settings" onAction={onAction}>
            Settings
          </MenuItem>
        }
      >
        <Button>Actions</Button>
      </Menu>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await userEvent.click(
      screen.getByRole("menuitem", { name: "Settings" }),
    );
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("calls Menu-level onAction with key", async () => {
    const onAction = vi.fn();

    render(
      <Menu
        onAction={onAction}
        content={
          <>
            <MenuItem id="edit">Edit</MenuItem>
            <MenuItem id="copy">Copy</MenuItem>
          </>
        }
      >
        <Button>Actions</Button>
      </Menu>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onAction).toHaveBeenCalledWith("edit");
  });

  it("supports disabled items in composition mode", async () => {
    const onAction = vi.fn();

    render(
      <Menu
        content={
          <MenuItem id="edit" isDisabled onAction={onAction}>
            Edit
          </MenuItem>
        }
      >
        <Button>Actions</Button>
      </Menu>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    const item = screen.getByRole("menuitem", { name: "Edit" });
    expect(item.getAttribute("aria-disabled")).toBe("true");
  });
});
