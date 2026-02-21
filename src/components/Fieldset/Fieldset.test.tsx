import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Fieldset } from "./Fieldset";

describe("Fieldset", () => {
  it("renders a fieldset element", () => {
    const { container } = render(
      <Fieldset>
        <div>Content</div>
      </Fieldset>,
    );
    expect(container.querySelector("fieldset")).not.toBeNull();
  });

  it("renders legend when provided", () => {
    render(
      <Fieldset legend="Patient Info">
        <div>Content</div>
      </Fieldset>,
    );
    expect(screen.getByText("Patient Info")).toBeDefined();
  });

  it("renders without legend", () => {
    const { container } = render(
      <Fieldset>
        <div>Content</div>
      </Fieldset>,
    );
    expect(container.querySelector("legend")).toBeNull();
  });

  it("renders children", () => {
    render(
      <Fieldset legend="Section">
        <div data-testid="child">Child content</div>
      </Fieldset>,
    );
    expect(screen.getByTestId("child")).toBeDefined();
  });
});
