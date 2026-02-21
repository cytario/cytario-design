import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "./Field";

describe("Field", () => {
  it("renders label", () => {
    render(
      <Field label="Name">
        <input />
      </Field>,
    );
    expect(screen.getByText("Name")).toBeDefined();
  });

  it("renders children", () => {
    render(
      <Field>
        <input data-testid="child" />
      </Field>,
    );
    expect(screen.getByTestId("child")).toBeDefined();
  });

  it("shows required indicator on label", () => {
    render(
      <Field label="Email" isRequired>
        <input />
      </Field>,
    );
    expect(screen.getByText("*")).toBeDefined();
  });

  it("shows description text", () => {
    render(
      <Field label="Username" description="Choose a unique name">
        <input />
      </Field>,
    );
    expect(screen.getByText("Choose a unique name")).toBeDefined();
  });

  it("shows string error message", () => {
    render(
      <Field label="Email" error="Invalid email">
        <input />
      </Field>,
    );
    expect(screen.getByText("Invalid email")).toBeDefined();
  });

  it("shows FieldError object message", () => {
    render(
      <Field label="Email" error={{ message: "Required field" }}>
        <input />
      </Field>,
    );
    expect(screen.getByText("Required field")).toBeDefined();
  });

  it("hides description when error is present", () => {
    render(
      <Field label="Email" description="Help text" error="Error text">
        <input />
      </Field>,
    );
    expect(screen.queryByText("Help text")).toBeNull();
    expect(screen.getByText("Error text")).toBeDefined();
  });

  it("renders without label", () => {
    render(
      <Field description="Some help">
        <input data-testid="child" />
      </Field>,
    );
    expect(screen.getByTestId("child")).toBeDefined();
    expect(screen.getByText("Some help")).toBeDefined();
  });
});
