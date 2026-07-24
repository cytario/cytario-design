import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { Description } from "./Description";

describe("Description", () => {
  it("renders children as a paragraph", () => {
    render(<Description>Body copy</Description>);
    const el = screen.getByText("Body copy");
    expect(el.tagName).toBe("P");
  });

  it("applies text-pretty and text-muted-foreground by default", () => {
    render(<Description>Body copy</Description>);
    const el = screen.getByText("Body copy");
    expect(el.className).toContain("text-pretty");
    expect(el.className).toContain("text-muted-foreground");
  });

  it("applies md size classes by default", () => {
    render(<Description>Body copy</Description>);
    const el = screen.getByText("Body copy");
    expect(el.className).toContain("text-base");
    expect(el.className).toContain("md:text-lg");
  });

  it("applies sm size classes when size=sm", () => {
    render(<Description size="sm">Body copy</Description>);
    const el = screen.getByText("Body copy");
    expect(el.className).toContain("text-sm");
    expect(el.className).toContain("md:text-base");
  });

  it("applies lg size classes when size=lg", () => {
    render(<Description size="lg">Body copy</Description>);
    const el = screen.getByText("Body copy");
    expect(el.className).toContain("text-lg");
    expect(el.className).toContain("md:text-xl");
  });

  it("applies xl size classes when size=xl", () => {
    render(<Description size="xl">Body copy</Description>);
    const el = screen.getByText("Body copy");
    expect(el.className).toContain("text-xl");
    expect(el.className).toContain("md:text-2xl");
  });

  it("className overrides default colour via twMerge", () => {
    render(<Description className="text-white">Body copy</Description>);
    const el = screen.getByText("Body copy");
    expect(el.className).toContain("text-white");
    expect(el.className).not.toContain("text-muted-foreground");
  });

  it("forwards id to the paragraph", () => {
    render(<Description id="intro">Body copy</Description>);
    expect(screen.getByText("Body copy").id).toBe("intro");
  });

  it("forwards data-* attributes", () => {
    render(
      <Description data-testid="desc" data-value="42">
        Body copy
      </Description>,
    );
    const el = screen.getByTestId("desc");
    expect(el.getAttribute("data-value")).toBe("42");
  });

  it("forwards ref to the paragraph element", () => {
    const ref = createRef<HTMLParagraphElement>();
    render(<Description ref={ref}>Body copy</Description>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("P");
  });

  it("forwards onClick handler", async () => {
    let clicked = false;
    const { userEvent } = await import("@testing-library/user-event");
    render(<Description onClick={() => (clicked = true)}>Body copy</Description>);
    await userEvent.click(screen.getByText("Body copy"));
    expect(clicked).toBe(true);
  });
});
