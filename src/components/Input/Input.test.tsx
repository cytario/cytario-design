import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders with label", () => {
    render(<Input label="Full name" />);
    expect(screen.getByLabelText("Full name")).toBeDefined();
  });

  it("accepts text input", async () => {
    render(<Input label="Name" />);
    const input = screen.getByRole("textbox");

    await userEvent.type(input, "Dr. Smith");
    expect(input).toHaveValue("Dr. Smith");
  });

  it("shows error message when errorMessage is provided", () => {
    render(<Input label="Email" errorMessage="Invalid email" />);
    expect(screen.getByText("Invalid email")).toBeDefined();
  });

  it("shows required indicator", () => {
    render(<Input label="Patient ID" isRequired />);
    expect(screen.getByText("*")).toBeDefined();
  });

  it("disables the input when isDisabled is true", () => {
    render(<Input label="Case" isDisabled />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("disabled");
  });

  it("shows description text", () => {
    render(<Input label="Username" description="Choose a unique name" />);
    expect(screen.getByText("Choose a unique name")).toBeDefined();
  });

  it("hides description when error is shown", () => {
    render(
      <Input
        label="Email"
        description="We will not share this"
        errorMessage="Invalid"
      />,
    );
    expect(screen.queryByText("We will not share this")).toBeNull();
    expect(screen.getByText("Invalid")).toBeDefined();
  });
});
