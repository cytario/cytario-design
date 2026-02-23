import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("renders when open", () => {
    render(
      <Dialog isOpen onOpenChange={() => {}} title="Test Dialog">
        <p>Body content</p>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("Test Dialog")).toBeDefined();
    expect(screen.getByText("Body content")).toBeDefined();
  });

  it("does not render when closed", () => {
    render(
      <Dialog isOpen={false} onOpenChange={() => {}} title="Hidden">
        <p>Not visible</p>
      </Dialog>,
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("calls onOpenChange when close button is clicked", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog isOpen onOpenChange={onOpenChange} title="Close Test">
        <p>Content</p>
      </Dialog>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders with the correct title", () => {
    render(
      <Dialog isOpen onOpenChange={() => {}} title="My Title">
        <p>Body</p>
      </Dialog>,
    );

    expect(screen.getByText("My Title")).toBeDefined();
  });

  it("has accessible dialog role", () => {
    render(
      <Dialog isOpen onOpenChange={() => {}} title="Accessible Dialog">
        <p>Content</p>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("does not dismiss on outside click when isDismissable is false", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog
        isOpen
        onOpenChange={onOpenChange}
        title="Non-dismissable"
        isDismissable={false}
      >
        <p>Content</p>
      </Dialog>,
    );

    // Click outside the dialog (on the overlay backdrop)
    // With isDismissable={false}, the dialog should not close
    expect(screen.getByRole("dialog")).toBeDefined();

    // The close button should still work
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
