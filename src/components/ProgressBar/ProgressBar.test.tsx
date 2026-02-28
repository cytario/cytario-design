import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders with progressbar role", () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole("progressbar")).toBeDefined();
  });

  it("sets aria-valuenow correctly", () => {
    render(<ProgressBar value={75} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("75");
  });

  it("sets aria-valuemin and aria-valuemax", () => {
    render(<ProgressBar value={50} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuemin")).toBe("0");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
  });

  it("uses label as aria-label", () => {
    render(<ProgressBar value={50} label="Tagging Coverage" />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-label")).toBe("Tagging Coverage");
  });

  it("uses default aria-label when no label", () => {
    render(<ProgressBar value={50} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-label")).toBe("Progress");
  });

  it("renders label text", () => {
    render(<ProgressBar value={50} label="Upload" />);
    expect(screen.getByText("Upload")).toBeDefined();
  });

  it("renders description text", () => {
    render(<ProgressBar value={50} description="50% complete" />);
    expect(screen.getByText("50% complete")).toBeDefined();
  });

  it("renders percentage value by default", () => {
    render(<ProgressBar value={65} label="Test" />);
    expect(screen.getByText("65%")).toBeDefined();
  });

  it("hides value when showValue is false", () => {
    const { container } = render(
      <ProgressBar value={65} showValue={false} />,
    );
    expect(container.textContent).not.toContain("65%");
  });

  it("clamps value to 0-100", () => {
    render(<ProgressBar value={150} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("100");
  });

  it("clamps negative value to 0", () => {
    render(<ProgressBar value={-10} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("0");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ProgressBar value={50} className="my-custom" />,
    );
    expect(container.firstElementChild?.className).toContain("my-custom");
  });
});
