import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { TruncatedText } from "./TruncatedText";

const LONG = "USL-2024-58461-3-very-long-specimen-identifier.ome.tif";

beforeAll(() => {
  // jsdom ships no ResizeObserver (the ellipsis hooks use it) and reports zero
  // layout dimensions. The clipboard is stubbed by userEvent.setup().
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

/** Force the overflow detection to report truncation by faking layout sizes. */
function mockOverflow(truncated: boolean) {
  const scroll = truncated ? 400 : 0;
  const offset = truncated ? 100 : 0;
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    get: () => scroll,
  });
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get: () => offset,
  });
}

afterEach(() => {
  // @ts-expect-error restore jsdom defaults
  delete HTMLElement.prototype.scrollWidth;
  // @ts-expect-error restore jsdom defaults
  delete HTMLElement.prototype.offsetWidth;
});

describe("TruncatedText", () => {
  it("renders the text", () => {
    mockOverflow(false);
    render(<TruncatedText>{LONG}</TruncatedText>);
    expect(screen.getByText(LONG)).toBeInTheDocument();
  });

  it("plain text is not focusable and not a button", () => {
    mockOverflow(true);
    render(<TruncatedText>{LONG}</TruncatedText>);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText(LONG)).not.toHaveAttribute("tabindex");
  });

  it("pins horizontal scroll so the ellipsis cannot be displaced", () => {
    mockOverflow(true);
    render(<TruncatedText>{LONG}</TruncatedText>);
    const span = screen.getByText(LONG);

    span.scrollLeft = 150;
    fireEvent.scroll(span);
    expect(span.scrollLeft).toBe(0);
  });

  describe("tooltip reveal (mouse dwell)", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("reveals the full text after the cursor rests when truncated", () => {
      mockOverflow(true);
      render(<TruncatedText>{LONG}</TruncatedText>);

      fireEvent.mouseMove(screen.getByText(LONG), { clientX: 10, clientY: 10 });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.getByRole("tooltip")).toHaveTextContent(LONG);
    });

    it("shows no tooltip when the text fits", () => {
      mockOverflow(false);
      render(<TruncatedText>Short</TruncatedText>);

      fireEvent.mouseMove(screen.getByText("Short"), { clientX: 10, clientY: 10 });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.queryByRole("tooltip")).toBeNull();
    });
  });

  describe("copyValue", () => {
    it("becomes a focusable button and copies on click", async () => {
      const user = userEvent.setup();
      mockOverflow(false);
      render(<TruncatedText copyValue={LONG}>Short</TruncatedText>);

      const button = screen.getByRole("button");
      await user.click(button);
      expect(await navigator.clipboard.readText()).toBe(LONG);
      expect(await screen.findByText("Copied")).toBeInTheDocument();
    });

    it("copies on Enter for keyboard users", async () => {
      const user = userEvent.setup();
      mockOverflow(false);
      render(<TruncatedText copyValue={LONG}>Short</TruncatedText>);

      await user.tab();
      expect(screen.getByRole("button")).toHaveFocus();
      await user.keyboard("{Enter}");
      expect(await navigator.clipboard.readText()).toBe(LONG);
    });
  });
});
