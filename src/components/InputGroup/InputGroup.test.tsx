import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InputGroup } from "./InputGroup";

describe("InputGroup", () => {
  it("renders children", () => {
    render(
      <InputGroup>
        <input data-testid="input-1" />
        <button data-testid="button-1">Go</button>
      </InputGroup>,
    );
    expect(screen.getByTestId("input-1")).toBeDefined();
    expect(screen.getByTestId("button-1")).toBeDefined();
  });

  it("applies joining classes to wrapper", () => {
    const { container } = render(
      <InputGroup>
        <input />
        <button>Go</button>
      </InputGroup>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("[&>*:first-child]:rounded-r-none");
    expect(wrapper.className).toContain("[&>*:last-child]:rounded-l-none");
    expect(wrapper.className).toContain("[&>*+*]:-ml-px");
  });

  it("applies custom className", () => {
    const { container } = render(
      <InputGroup className="custom-class">
        <input />
      </InputGroup>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("custom-class");
  });
});
