import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";

describe("Popover", () => {
  it("does not show content by default", () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent placement="bottom">
          Popover body
        </PopoverContent>
      </Popover>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens on trigger click", async () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent placement="bottom">
          Popover body
        </PopoverContent>
      </Popover>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog")).toBeDefined();
  });

  it("closes on Escape key", async () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent placement="bottom">
          Popover body
        </PopoverContent>
      </Popover>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog")).toBeDefined();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("returns focus to trigger on close", async () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent placement="bottom">
          Popover body
        </PopoverContent>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });

    await userEvent.click(trigger);
    expect(await screen.findByRole("dialog")).toBeDefined();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });

  it("renders interactive content with close function", async () => {
    const onSelect = vi.fn();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent placement="bottom">
          {({ close }) => (
            <button
              type="button"
              onClick={() => {
                onSelect("picked");
                close();
              }}
            >
              Pick me
            </button>
          )}
        </PopoverContent>
      </Popover>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog")).toBeDefined();

    await userEvent.click(screen.getByRole("button", { name: "Pick me" }));
    expect(onSelect).toHaveBeenCalledWith("picked");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("renders when controlled with isOpen", () => {
    render(
      <Popover isOpen onOpenChange={() => {}}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent placement="bottom">
          Controlled content
        </PopoverContent>
      </Popover>,
    );

    expect(screen.getByRole("dialog")).toBeDefined();
  });
});
