import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LogPane } from "./LogPane";

const line = (message: string) => ({ message });

/** Stands in for the clipboard, which jsdom does not implement. */
const stubClipboard = (writeText: (text: string) => Promise<void>) => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
};

describe("LogPane", () => {
  it("renders a single line's text", () => {
    render(<LogPane lines={[line("pulling image")]} />);
    expect(screen.getByText("pulling image")).toBeDefined();
  });

  it("renders multiple lines in order", () => {
    render(
      <LogPane
        lines={[line("first"), line("\u001b[36msecond\u001b[0m"), line("third")]}
      />,
    );
    const pane = screen.getByRole("region", { name: "Log output" });
    expect(pane.textContent).toBe("firstsecondthird");
  });

  it("never renders escape sequences as literal text", () => {
    render(
      <LogPane
        lines={[
          line("\u001b[0;93mFAILED\u001b[m"),
          line("\u001b[36mcytario.worker\u001b[0m - \u001b[33mpulling image\u001b[0m"),
          line("mixed\u001b[2Kplain"),
        ]}
      />,
    );
    const pane = screen.getByRole("region", { name: "Log output" });
    expect(pane.textContent).not.toContain("\u001b");
    expect(pane.textContent).toContain("FAILED");
    expect(pane.textContent).toContain("mixedplain");
  });

  it("applies the palette color to a colored segment as inline style", () => {
    render(
      <LogPane lines={[line("\u001b[36mcytario.worker\u001b[0m - \u001b[33mpulling image\u001b[0m")]} />,
    );
    const cyan = screen.getByText("cytario.worker");
    expect(cyan.style.color).toBe("rgb(111, 201, 212)");
    const yellow = screen.getByText("pulling image");
    expect(yellow.style.color).toBe("rgb(232, 205, 138)");
    expect(yellow.style.color).not.toBe(cyan.style.color);
  });

  it("renders bold and underline as inline style", () => {
    render(
      <LogPane
        lines={[line("\u001b[1;4mphase one\u001b[0m\u001b[21mplain phase\u001b[0m")]}
      />,
    );
    const bold = screen.getByText("phase one");
    expect(bold.style.fontWeight).toBe("bold");
    expect(bold.style.textDecoration).toContain("underline");
    const plain = screen.getByText("plain phase");
    expect(plain.style.fontWeight).toBe("");
    expect(plain.style.textDecoration).toBe("");
  });

  it("consumes unsupported and truncated sequences without dropping text", () => {
    render(
      <LogPane
        lines={[
          line("a\u001b[2Kb — cursor move consumed"),
          line("stalled\u001b[38;5m — malformed extended color"),
          line("done\u001b["),
        ]}
      />,
    );
    const pane = screen.getByRole("region", { name: "Log output" });
    expect(pane.textContent).toContain("ab — cursor move consumed");
    // The truncated escape splits the line into two unstyled segments that
    // sit side by side; the readable text is fully preserved.
    expect(pane.textContent).toContain("stalled — malformed extended color");
    expect(pane.textContent).toContain("done");
  });

  it("renders nothing when there are no lines", () => {
    const { container } = render(<LogPane lines={[]} />);
    expect(container.firstElementChild).toBeNull();
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("keeps the consumer-provided empty state visible without the pane", () => {
    const { container } = render(
      <div>
        <p>No log output yet.</p>
        <LogPane lines={[]} />
      </div>,
    );
    expect(screen.getByText("No log output yet.")).toBeDefined();
    expect(container.querySelector("div[role='region']")).toBeNull();
  });

  it("merges className with tailwind-merge", () => {
    render(<LogPane lines={[line("hi")]} className="max-h-64" />);
    const pane = screen.getByRole("region", { name: "Log output" });
    expect(pane.className).toContain("max-h-64");
    expect(pane.className).not.toContain("max-h-96");
    // Default classes survive the merge.
    expect(pane.className).toContain("whitespace-pre-wrap");
    expect(pane.className).toContain("break-all");
  });

  it("renders as a labelled, keyboard-focusable region", () => {
    render(<LogPane lines={[line("hi")]} label="Build log" />);
    const pane = screen.getByRole("region", { name: "Build log" });
    expect(pane.getAttribute("tabIndex")).toBe("0");
  });

  it("exposes the scroll container and text-preserving classes", () => {
    render(<LogPane lines={[line("hi")]} />);
    const pane = screen.getByRole("region", { name: "Log output" });
    expect(pane.className).toContain("overflow-y-auto");
    expect(pane.className).toContain("whitespace-pre-wrap");
    expect(pane.className).toContain("break-all");
    expect(pane.className).toContain("font-mono");
  });

  it("applies the size bound classes", () => {
    const { rerender } = render(<LogPane lines={[line("hi")]} size="sm" />);
    expect(screen.getByRole("region").className).toContain("max-h-48");
    rerender(<LogPane lines={[line("hi")]} size="lg" />);
    expect(screen.getByRole("region").className).toContain("max-h-[36rem]");
  });

  it("uses a fixed height when isFixedHeight is set", () => {
    render(<LogPane lines={[line("hi")]} isFixedHeight />);
    expect(screen.getByRole("region").className).toContain("h-96");
    expect(screen.getByRole("region").className).not.toContain("max-h-96");
  });

  it("spreads HTML attributes onto the pane", () => {
    render(
      <LogPane
        lines={[line("hi")]}
        id="job-log-pane"
        aria-describedby="job-log-hint"
      />,
    );
    const pane = screen.getByRole("region", { name: "Log output" });
    expect(pane.id).toBe("job-log-pane");
    expect(pane.getAttribute("aria-describedby")).toBe("job-log-hint");
  });

  it("does not render timestamps as visible text", () => {
    render(
      <LogPane
        lines={[
          {
            timestamp: "2026-02-15T09:42:03Z",
            message: "10 pulled layers",
          },
        ]}
      />,
    );
    const pane = screen.getByRole("region", { name: "Log output" });
    expect(pane.textContent).toBe("10 pulled layers");
  });

  it("renders no markup for an unstyled segment", () => {
    render(<LogPane lines={[line("plain text")]} />);
    const pane = screen.getByRole("region", { name: "Log output" });
    expect(pane.querySelector("span")).toBeNull();
    expect(pane.textContent).toBe("plain text");
  });

  it("offers copy and scroll-to-bottom controls", () => {
    render(<LogPane lines={[line("a"), line("b")]} />);
    expect(screen.getByRole("button", { name: "Copy log" })).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Scroll to bottom" }),
    ).toBeDefined();
  });

  it("hides the controls until the cursor is over the pane", () => {
    render(<LogPane lines={[line("a")]} />);
    // The button sits inside a Tooltip wrapper, so walk up to the control row.
    const controls = screen
      .getByRole("button", { name: "Copy log" })
      .closest("div[class*='absolute']")!;
    // Hidden by default, revealed by the pane's hover / focus-within state.
    expect(controls.className).toContain("opacity-0");
    expect(controls.className).toContain("group-hover:opacity-100");
    expect(controls.className).toContain("group-focus-within:opacity-100");
    // An invisible control must not be clickable where it cannot be seen.
    expect(controls.className).toContain("pointer-events-none");
    expect(controls.className).toContain("group-hover:pointer-events-auto");
    // The pane is the group the reveal is keyed on.
    const pane = screen.getByRole("region", { name: "Log output" });
    expect(pane.parentElement!.className).toContain("group");
  });

  it("copies the raw log lines, escape sequences included", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard(writeText);

    render(<LogPane lines={[line("\u001b[36mfirst\u001b[0m"), line("second")]} />);
    await user.click(screen.getByRole("button", { name: "Copy log" }));

    // The raw bytes, so the log keeps its colors wherever it is pasted back.
    expect(writeText).toHaveBeenCalledWith("\u001b[36mfirst\u001b[0m\nsecond");
  });

  it("announces the copy to screen readers", async () => {
    const user = userEvent.setup();
    stubClipboard(vi.fn().mockResolvedValue(undefined));

    render(<LogPane lines={[line("hello")]} />);
    expect(screen.getByRole("status").textContent).toBe("");
    await user.click(screen.getByRole("button", { name: "Copy log" }));
    expect(await screen.findByText("Log copied")).toBeDefined();
  });

  it("fails silently when the clipboard rejects", async () => {
    const user = userEvent.setup();
    stubClipboard(vi.fn().mockRejectedValue(new Error("denied")));

    render(<LogPane lines={[line("hello")]} />);
    await user.click(screen.getByRole("button", { name: "Copy log" }));
    expect(
      screen.getByRole("region", { name: "Log output" }).textContent,
    ).toBe("hello");
  });

  it("scrolls the pane to its bottom", async () => {
    const user = userEvent.setup();
    render(<LogPane lines={[line("a"), line("b")]} />);
    const pane = screen.getByRole("region", { name: "Log output" });

    // jsdom does no layout, so stand in for the measurement the real pane has.
    Object.defineProperty(pane, "scrollHeight", {
      configurable: true,
      value: 4000,
    });

    await user.click(screen.getByRole("button", { name: "Scroll to bottom" }));
    expect(pane.scrollTop).toBe(4000);
  });
});