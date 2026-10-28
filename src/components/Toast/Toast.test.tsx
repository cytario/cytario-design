import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "./Toast";
import type { ToastPlacement } from "./Toast";

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
    expect(status.className).toContain("bg-success-surface");
  });

  it("renders error variant correctly", async () => {
    renderWithProvider(<TestTrigger variant="error" message="Failed!" />);

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    const status = screen.getByRole("status");
    expect(status.className).toContain("bg-destructive-surface");
  });

  it("renders info variant correctly", async () => {
    renderWithProvider(<TestTrigger variant="info" message="FYI" />);

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    const status = screen.getByRole("status");
    expect(status.className).toContain("bg-info-surface");
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
