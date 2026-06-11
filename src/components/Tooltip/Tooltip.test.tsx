import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "../Button";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("renders the trigger element", () => {
    render(
      <Tooltip content="Help text">
        <Button>Trigger</Button>
      </Tooltip>,
    );
    expect(screen.getByRole("button", { name: "Trigger" })).toBeDefined();
  });

  it("does not show the tooltip by default", () => {
    render(
      <Tooltip content="Help text">
        <Button>Trigger</Button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  describe("keyboard", () => {
    it("shows immediately on keyboard focus", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Help text">
          <Button>Trigger</Button>
        </Tooltip>,
      );

      await user.tab();
      expect(screen.getByRole("button", { name: "Trigger" })).toHaveFocus();
      expect(screen.getByRole("tooltip")).toHaveTextContent("Help text");
    });

    it("hides on blur", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Help text">
          <Button>Trigger</Button>
        </Tooltip>,
      );

      await user.tab();
      expect(screen.getByRole("tooltip")).toBeDefined();

      await user.tab();
      expect(screen.queryByRole("tooltip")).toBeNull();
    });

    it("hides on Escape while focused", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Help text">
          <Button>Trigger</Button>
        </Tooltip>,
      );

      await user.tab();
      expect(screen.getByRole("tooltip")).toBeDefined();

      await user.keyboard("{Escape}");
      expect(screen.queryByRole("tooltip")).toBeNull();
    });
  });

  describe("mouse", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("shows after the cursor rests for 500ms", () => {
      render(
        <Tooltip content="Help text">
          <Button>Trigger</Button>
        </Tooltip>,
      );
      const button = screen.getByRole("button", { name: "Trigger" });

      fireEvent.mouseMove(button, { clientX: 10, clientY: 10 });
      expect(screen.queryByRole("tooltip")).toBeNull();

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.getByRole("tooltip")).toHaveTextContent("Help text");
    });

    it("still shows when movement stays within the 5px rest threshold", () => {
      render(
        <Tooltip content="Help text">
          <Button>Trigger</Button>
        </Tooltip>,
      );
      const button = screen.getByRole("button", { name: "Trigger" });

      fireEvent.mouseMove(button, { clientX: 10, clientY: 10 });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      // 4px diagonal jitter — within threshold, must NOT restart the dwell
      fireEvent.mouseMove(button, { clientX: 14, clientY: 13 });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.getByRole("tooltip")).toHaveTextContent("Help text");
    });

    it("restarts the dwell when movement exceeds the 5px threshold", () => {
      render(
        <Tooltip content="Help text">
          <Button>Trigger</Button>
        </Tooltip>,
      );
      const button = screen.getByRole("button", { name: "Trigger" });

      fireEvent.mouseMove(button, { clientX: 10, clientY: 10 });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      // 6px move — beyond threshold, restarts the 500ms wait
      fireEvent.mouseMove(button, { clientX: 16, clientY: 10 });
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(screen.queryByRole("tooltip")).toBeNull();
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(screen.getByRole("tooltip")).toHaveTextContent("Help text");
    });

    it("hides when the cursor moves beyond the threshold after showing", () => {
      render(
        <Tooltip content="Help text">
          <Button>Trigger</Button>
        </Tooltip>,
      );
      const button = screen.getByRole("button", { name: "Trigger" });

      fireEvent.mouseMove(button, { clientX: 10, clientY: 10 });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.getByRole("tooltip")).toBeDefined();

      fireEvent.mouseMove(button, { clientX: 60, clientY: 60 });
      expect(screen.queryByRole("tooltip")).toBeNull();
    });

    it("does not show while the cursor keeps moving", () => {
      render(
        <Tooltip content="Help text">
          <Button>Trigger</Button>
        </Tooltip>,
      );
      const button = screen.getByRole("button", { name: "Trigger" });

      fireEvent.mouseMove(button, { clientX: 10, clientY: 10 });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      fireEvent.mouseMove(button, { clientX: 60, clientY: 60 });
      expect(screen.queryByRole("tooltip")).toBeNull();
    });

    it("hides on mouse leave", () => {
      render(
        <Tooltip content="Help text">
          <Button>Trigger</Button>
        </Tooltip>,
      );
      const button = screen.getByRole("button", { name: "Trigger" });

      fireEvent.mouseMove(button, { clientX: 10, clientY: 10 });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.getByRole("tooltip")).toBeDefined();

      fireEvent.mouseLeave(button);
      expect(screen.queryByRole("tooltip")).toBeNull();
    });
  });

  it("renders nothing when content is null", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content={null}>
        <Button>Trigger</Button>
      </Tooltip>,
    );

    await user.tab();
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
