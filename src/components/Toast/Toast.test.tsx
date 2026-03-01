import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast, createToastBridge } from "./Toast";
import type { ToastBridge, ToastPlacement } from "./Toast";

function TestTrigger({ variant = "success" as const, message = "Test toast" }) {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast({ variant, message })}>
      Trigger
    </button>
  );
}

function renderWithProvider(ui: React.ReactNode, placement?: ToastPlacement) {
  return render(<ToastProvider placement={placement}>{ui}</ToastProvider>);
}

describe("Toast", () => {
  it("shows a toast when triggered", async () => {
    renderWithProvider(<TestTrigger />);

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    expect(screen.getByText("Test toast")).toBeDefined();
  });

  it("renders with role=status for accessibility", async () => {
    renderWithProvider(<TestTrigger />);

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    expect(screen.getByRole("status")).toBeDefined();
  });

  it("dismisses when close button is clicked", async () => {
    renderWithProvider(<TestTrigger />);

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.getByText("Test toast")).toBeDefined();

    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));

    // Wait for exit animation
    await vi.waitFor(() => {
      expect(screen.queryByText("Test toast")).toBeNull();
    });
  });

  it("renders success variant correctly", async () => {
    renderWithProvider(<TestTrigger variant="success" message="Saved!" />);

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    const status = screen.getByRole("status");
    expect(status.className).toContain("var(--color-surface-success)");
  });

  it("renders error variant correctly", async () => {
    renderWithProvider(<TestTrigger variant="error" message="Failed!" />);

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    const status = screen.getByRole("status");
    expect(status.className).toContain("var(--color-surface-danger)");
  });

  it("renders info variant correctly", async () => {
    renderWithProvider(<TestTrigger variant="info" message="FYI" />);

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    const status = screen.getByRole("status");
    expect(status.className).toContain("var(--color-surface-info)");
  });

  it("shows multiple toasts", async () => {
    renderWithProvider(
      <>
        <TestTrigger message="First" />
      </>,
    );

    const trigger = screen.getByRole("button", { name: "Trigger" });
    await userEvent.click(trigger);
    await userEvent.click(trigger);

    const statuses = screen.getAllByRole("status");
    expect(statuses.length).toBeGreaterThanOrEqual(2);
  });

  it("throws when useToast is used outside ToastProvider", () => {
    function Broken() {
      useToast();
      return null;
    }

    expect(() => render(<Broken />)).toThrow(
      "useToast must be used within a ToastProvider",
    );
  });

  it("renders with top-center placement", async () => {
    renderWithProvider(<TestTrigger />, "top-center");

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    const status = screen.getByRole("status");
    expect(status.className).toContain("slide-in-from-top");
  });

  it("renders with top-right placement", async () => {
    renderWithProvider(<TestTrigger />, "top-right");

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    const status = screen.getByRole("status");
    expect(status.className).toContain("slide-in-from-right");
  });

  it("renders with bottom-center placement", async () => {
    renderWithProvider(<TestTrigger />, "bottom-center");

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    const status = screen.getByRole("status");
    expect(status.className).toContain("slide-in-from-bottom");
  });

  it("defaults to bottom-right placement", async () => {
    renderWithProvider(<TestTrigger />);

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    const status = screen.getByRole("status");
    expect(status.className).toContain("slide-in-from-right");
  });
});

describe("createToastBridge", () => {
  it("emit triggers subscriber", () => {
    const bridge = createToastBridge();
    const handler = vi.fn();

    bridge.subscribe(handler);
    bridge.emit({ variant: "success", message: "hello" });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({ variant: "success", message: "hello" });
  });

  it("unsubscribe stops further notifications", () => {
    const bridge = createToastBridge();
    const handler = vi.fn();

    const unsub = bridge.subscribe(handler);
    unsub();
    bridge.emit({ variant: "info", message: "ignored" });

    expect(handler).not.toHaveBeenCalled();
  });

  it("supports multiple subscribers", () => {
    const bridge = createToastBridge();
    const a = vi.fn();
    const b = vi.fn();

    bridge.subscribe(a);
    bridge.subscribe(b);
    bridge.emit({ variant: "error", message: "boom" });

    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
  });
});

describe("ToastProvider with bridge", () => {
  it("shows toasts from external bridge emits", async () => {
    const bridge = createToastBridge();

    render(
      <ToastProvider bridge={bridge}>
        <div>App content</div>
      </ToastProvider>,
    );

    act(() => {
      bridge.emit({ variant: "error", message: "External error" });
    });

    expect(screen.getByText("External error")).toBeDefined();
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("unsubscribes from bridge on unmount", () => {
    const bridge = createToastBridge();

    const { unmount } = render(
      <ToastProvider bridge={bridge}>
        <div>App</div>
      </ToastProvider>,
    );

    unmount();

    // Emitting after unmount should not throw or render anything
    act(() => {
      bridge.emit({ variant: "info", message: "After unmount" });
    });

    expect(screen.queryByText("After unmount")).toBeNull();
  });
});
