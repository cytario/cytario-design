import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeDefined();
  });

  it("renders as a div by default", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("renders header with border separator", () => {
    render(<Card header={<span>Header</span>}>Body</Card>);
    expect(screen.getByText("Header")).toBeDefined();
    expect(screen.getByText("Body")).toBeDefined();
    const header = screen.getByText("Header").parentElement;
    expect(header?.className).toContain("border-b");
  });

  it("renders footer with border separator", () => {
    const { container } = render(
      <Card footer={<span>Footer</span>}>Body</Card>,
    );
    expect(screen.getByText("Footer")).toBeDefined();
    const footer = screen.getByText("Footer").parentElement;
    expect(footer?.className).toContain("border-t");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Card className="my-custom">Custom</Card>,
    );
    expect(container.firstElementChild?.className).toContain("my-custom");
  });
});
