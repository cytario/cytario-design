import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "./Toast";

function TestTrigger({ variant = "success" as const, message = "Test toast" }) {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast({ variant, message })}>
      Trigger
    </button>
  );
}

function renderWithProvider(ui: React.ReactNode) {
  return render(<ToastProvider>{ui}</ToastProvider>);
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
    expect(status.className).toContain("bg-green-50");
  });

  it("renders error variant correctly", async () => {
    renderWithProvider(<TestTrigger variant="error" message="Failed!" />);

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    const status = screen.getByRole("status");
    expect(status.className).toContain("bg-rose-50");
  });

  it("renders info variant correctly", async () => {
    renderWithProvider(<TestTrigger variant="info" message="FYI" />);

    await userEvent.click(screen.getByRole("button", { name: "Trigger" }));

    const status = screen.getByRole("status");
    expect(status.className).toContain("bg-slate-50");
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
});
