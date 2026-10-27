import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TriggerThemeProvider, useTriggerTheme } from "./useTriggerTheme";

function ThemeProbe() {
  const theme = useTriggerTheme();
  return <span data-testid="theme-probe">{theme}</span>;
}

function renderProbe() {
  render(
    <TriggerThemeProvider>
      <ThemeProbe />
    </TriggerThemeProvider>,
  );
  return screen.getByTestId("theme-probe");
}

afterEach(() => {
  cleanup();
  delete document.body.dataset.theme;
  delete document.documentElement.dataset.theme;
});

describe("TriggerThemeProvider", () => {
  it("captures the root data-theme on mount", () => {
    document.documentElement.dataset.theme = "dark";
    expect(renderProbe()).toHaveTextContent("dark");
  });

  it("falls back to light when the root carries no data-theme", () => {
    expect(renderProbe()).toHaveTextContent("light");
  });

  it("follows a root data-theme flip while mounted", async () => {
    document.documentElement.dataset.theme = "dark";
    const probe = renderProbe();
    expect(probe).toHaveTextContent("dark");

    await act(async () => {
      document.documentElement.dataset.theme = "light";
    });

    expect(probe).toHaveTextContent("light");
  });

  it("captures the theme of a themed container around the trigger", async () => {
    document.documentElement.dataset.theme = "light";
    document.body.dataset.theme = "dark";
    // Flush the shared observer before mounting so pending attribute changes
    // cannot be delivered to the provider after the act scope of the render.
    await act(async () => {});

    expect(renderProbe()).toHaveTextContent("dark");
  });

  it("follows a themed container's data-theme flip while mounted", async () => {
    document.documentElement.dataset.theme = "light";
    document.body.dataset.theme = "dark";
    await act(async () => {});
    const probe = renderProbe();
    expect(probe).toHaveTextContent("dark");

    await act(async () => {
      document.body.dataset.theme = "light";
    });

    expect(probe).toHaveTextContent("light");
  });
});
