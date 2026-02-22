import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InputGroup } from "./InputGroup";
import { useInputGroup } from "./InputGroupContext";

/** Test helper that renders its position from context */
function PositionProbe({ testId }: { testId: string }) {
  const { inGroup, position } = useInputGroup();
  return (
    <div data-testid={testId} data-position={position} data-in-group={String(inGroup)} />
  );
}

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

  it("provides 'start' position to first child", () => {
    render(
      <InputGroup>
        <PositionProbe testId="first" />
        <PositionProbe testId="last" />
      </InputGroup>,
    );
    expect(screen.getByTestId("first").getAttribute("data-position")).toBe("start");
    expect(screen.getByTestId("first").getAttribute("data-in-group")).toBe("true");
  });

  it("provides 'end' position to last child", () => {
    render(
      <InputGroup>
        <PositionProbe testId="first" />
        <PositionProbe testId="last" />
      </InputGroup>,
    );
    expect(screen.getByTestId("last").getAttribute("data-position")).toBe("end");
  });

  it("provides 'middle' position to middle children", () => {
    render(
      <InputGroup>
        <PositionProbe testId="first" />
        <PositionProbe testId="middle" />
        <PositionProbe testId="last" />
      </InputGroup>,
    );
    expect(screen.getByTestId("middle").getAttribute("data-position")).toBe("middle");
  });

  it("provides 'standalone' when there is only one child", () => {
    render(
      <InputGroup>
        <PositionProbe testId="only" />
      </InputGroup>,
    );
    expect(screen.getByTestId("only").getAttribute("data-position")).toBe("standalone");
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
