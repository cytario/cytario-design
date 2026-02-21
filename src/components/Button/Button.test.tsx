import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeDefined();
  });

  it("calls onPress when clicked", async () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Press</Button>);

    await userEvent.click(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", async () => {
    const onPress = vi.fn();
    render(
      <Button onPress={onPress} isDisabled>
        Disabled
      </Button>,
    );

    await userEvent.click(screen.getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("shows loading spinner and disables interaction", async () => {
    const onPress = vi.fn();
    render(
      <Button onPress={onPress} isLoading>
        Loading
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("disabled");

    // SVG spinner should be present
    const svg = button.querySelector("svg");
    expect(svg).not.toBeNull();

    await userEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("has accessible role='button'", () => {
    render(<Button>Accessible</Button>);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("supports keyboard activation with Enter", async () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Enter</Button>);

    screen.getByRole("button").focus();
    await userEvent.keyboard("{Enter}");
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard activation with Space", async () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Space</Button>);

    screen.getByRole("button").focus();
    await userEvent.keyboard(" ");
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
