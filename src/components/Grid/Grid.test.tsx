import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { Grid } from "./Grid";

function gridOf(text: string): HTMLElement {
  return screen.getByText(text).closest(".grid")!;
}

describe("Grid", () => {
  it("renders children in a div", () => {
    render(
      <Grid>
        <div>Cell A</div>
        <div>Cell B</div>
      </Grid>,
    );
    const el = gridOf("Cell A");
    expect(el.tagName).toBe("DIV");
    expect(el).toContainElement(screen.getByText("Cell B"));
  });

  it("forwards data-* attributes to the grid element", () => {
    render(
      <Grid data-testid="grid" data-value="42">
        x
      </Grid>,
    );
    const el = screen.getByTestId("grid");
    expect(el.getAttribute("data-value")).toBe("42");
  });

  it("applies grid with a single column and default gap by default", () => {
    render(<Grid data-testid="grid">x</Grid>);
    const el = screen.getByTestId("grid");
    expect(el.className).toContain("grid");
    expect(el.className).toContain("grid-cols-1");
    expect(el.className).not.toContain("sm:grid-cols");
    expect(el.className).toContain("gap-x-4");
    expect(el.className).toContain("gap-y-4");
  });

  it("applies the responsive step classes when columns > 1", () => {
    render(<Grid columns={2}>x</Grid>);
    const el = gridOf("x");
    expect(el.className).toContain("grid-cols-1");
    expect(el.className).toContain("sm:grid-cols-2");
  });

  it("applies sm:grid-cols-3 and sm:grid-cols-4 for higher column counts", () => {
    render(<Grid columns={3}>x</Grid>);
    expect(gridOf("x").className).toContain("sm:grid-cols-3");
    render(<Grid columns={4}>y</Grid>);
    expect(gridOf("y").className).toContain("sm:grid-cols-4");
  });

  it("applies per-axis gap overrides", () => {
    render(
      <Grid gapX={6} gapY={3}>
        x
      </Grid>,
    );
    const el = gridOf("x");
    expect(el.className).toContain("gap-x-6");
    expect(el.className).toContain("gap-y-3");
  });

  it("applies the shared gap to both axes", () => {
    render(<Grid gap={2}>x</Grid>);
    const el = gridOf("x");
    expect(el.className).toContain("gap-x-2");
    expect(el.className).toContain("gap-y-2");
  });

  it("className overrides gap via twMerge", () => {
    render(
      <Grid gap={4} className="gap-x-8">
        x
      </Grid>,
    );
    const el = gridOf("x");
    expect(el.className).toContain("gap-x-8");
    expect(el.className).not.toContain("gap-x-4");
  });

  it("forwards ref to the grid element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Grid ref={ref}>x</Grid>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("DIV");
  });
});
