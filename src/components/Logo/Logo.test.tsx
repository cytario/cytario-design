import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders an img element with aria-label", () => {
    render(<Logo />);
    expect(screen.getByRole("img", { name: "Cytario Logo" })).toBeDefined();
  });

  it("renders an svg element", () => {
    const { container } = render(<Logo />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders 8 path elements (c, y, t, a, r, i, o, \u00ae)", () => {
    const { container } = render(<Logo />);
    expect(container.querySelectorAll("path")).toHaveLength(8);
  });

  it("uses var(--logo-fill) for the wordmark fill via style", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");
    expect(svg?.style.fill).toBe("var(--logo-fill)");
  });

  it("highlights the \u2018o\u2019 with var(--logo-highlight) via style", () => {
    const { container } = render(<Logo />);
    const oPath = container.querySelector('path[d^="M47.169"]');
    expect(oPath?.style.fill).toBe("var(--logo-highlight)");
  });

  it("other paths inherit fill from the svg", () => {
    const { container } = render(<Logo />);
    const cPath = container.querySelector('path[d^="M7.043"]');
    expect(cPath?.style.fill).toBe("");
  });

  it("applies scale to width and height", () => {
    const { container } = render(<Logo scale={2} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("112");
    expect(svg?.getAttribute("height")).toBe("40");
  });

  it("escape hatch color sets --logo-fill CSS var", () => {
    const { container } = render(<Logo color="#ff0000" />);
    const svg = container.querySelector("svg");
    expect(svg?.style.getPropertyValue("--logo-fill")).toBe("#ff0000");
  });

  it("escape hatch highlightColor sets --logo-highlight CSS var", () => {
    const { container } = render(
      <Logo color="#000000" highlightColor="#ff0000" />,
    );
    const svg = container.querySelector("svg");
    expect(svg?.style.getPropertyValue("--logo-highlight")).toBe("#ff0000");
  });

  it("monochrome via escape hatch sets both CSS vars", () => {
    const { container } = render(
      <Logo color="#000000" highlightColor="#000000" />,
    );
    const svg = container.querySelector("svg");
    expect(svg?.style.getPropertyValue("--logo-fill")).toBe("#000000");
    expect(svg?.style.getPropertyValue("--logo-highlight")).toBe("#000000");
  });

  it("applies className to the svg", () => {
    const { container } = render(<Logo className="my-logo" />);
    expect(container.querySelector("svg")?.classList.contains("my-logo")).toBe(
      true,
    );
  });
});
