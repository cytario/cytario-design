import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../Button";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("renders the trigger element", () => {
    render(
      <Tooltip content="Help text">
        <Button>Trigger</Button>
      </Tooltip>,
    );
    expect(screen.getByRole("button", { name: "Trigger" })).toBeDefined();
  });

  it("does not show tooltip by default", () => {
    render(
      <Tooltip content="Help text">
        <Button>Trigger</Button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("shows tooltip on focus", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text" delay={0}>
        <Button>Trigger</Button>
      </Tooltip>,
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "Trigger" })).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toBeDefined();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Help text");
  });

  it("hides tooltip on blur", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text" delay={0}>
        <Button>Trigger</Button>
      </Tooltip>,
    );

    await user.tab();
    expect(await screen.findByRole("tooltip")).toBeDefined();

    await user.tab();
    // After blur, tooltip should be removed
    await expect
      .poll(() => screen.queryByRole("tooltip"))
      .toBeNull();
  });

  it("respects placement prop", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Bottom tip" placement="bottom" delay={0}>
        <Button>Trigger</Button>
      </Tooltip>,
    );

    await user.tab();
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Bottom tip");
  });
});
