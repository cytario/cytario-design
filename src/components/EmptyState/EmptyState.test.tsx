import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Inbox } from "lucide-react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the title", () => {
    render(<EmptyState title="No items" />);
    expect(screen.getByText("No items")).toBeDefined();
  });

  it("renders the description when provided", () => {
    render(
      <EmptyState title="Empty" description="Nothing to see here." />,
    );
    expect(screen.getByText("Nothing to see here.")).toBeDefined();
  });

  it("does not render description when not provided", () => {
    const { container } = render(<EmptyState title="Empty" />);
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(0);
  });

  it("renders an icon when provided", () => {
    const { container } = render(
      <EmptyState icon={Inbox} title="Empty inbox" />,
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("does not render an icon when not provided", () => {
    const { container } = render(<EmptyState title="No icon" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeNull();
  });

  it("renders the action slot", () => {
    render(
      <EmptyState
        title="Empty"
        action={<button type="button">Create</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Create" })).toBeDefined();
  });

  it("applies custom className", () => {
    const { container } = render(
      <EmptyState title="Custom" className="my-custom-class" />,
    );
    expect(container.firstElementChild?.className).toContain("my-custom-class");
  });
});
