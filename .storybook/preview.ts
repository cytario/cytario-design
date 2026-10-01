import { createElement, useEffect, useState } from "react";
import type { Preview } from "storybook/react";
import { DocsContainer } from "@storybook/addon-docs/blocks";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import "../src/styles/tailwind.css";
import { darkTheme, lightTheme } from "./theme";

/** Reads the theme global for bare MDX docs pages (Introduction, Foundation).
 * The docs container's context is a DocsContextProps, which has no `globals`
 * field — the toolbar global has to be read from the iframe URL initially and
 * then kept current via GLOBALS_UPDATED channel events (same mechanism
 * addon-docs' internal useGlobals hook uses). Side-by-side renders the docs
 * chrome light (the story canvas shows both themes). Dark is the default. */
function initialDocsTheme(): string {
  const raw = new URLSearchParams(window.location.search).get("globals");
  const theme = raw?.split(",")?.find((kv) => kv.startsWith("theme:"));
  const value = theme?.split(":")[1] || "dark";
  return value === "side-by-side" ? "light" : value;
}

/**
 * Docs container for bare MDX pages so they follow the Theme toolbar. It
 * wraps the default DocsContainer (which supplies the styled-components
 * ThemeProvider the docs blocks rely on) rather than replacing it, repoints
 * its Storybook theme, and applies data-theme to the iframe's <html> so body
 * bg and design tokens flip with the selection.
 */
function DocsThemeContainer({
  channel,
  children,
  context,
}: {
  channel: { on: Function; off: Function };
  children: React.ReactNode;
  context: unknown;
}) {
  const [theme, setTheme] = useState(initialDocsTheme);

  useEffect(() => {
    const onGlobalsUpdated = (changed: { globals: Record<string, string> }) => {
      const selected = changed.globals?.theme || "dark";
      setTheme(selected === "side-by-side" ? "light" : selected);
    };
    channel.on(GLOBALS_UPDATED, onGlobalsUpdated);
    return () => channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
  }, [channel]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return createElement(
    DocsContainer,
    { context, theme: theme === "dark" ? darkTheme : lightTheme },
    createElement("div", { "data-theme": theme }, children),
  );
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color theme for components",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
          { value: "side-by-side", title: "Side by side", icon: "sidebyside" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "dark",
  },
  decorators: [
    (Story, context) => {
      const selectedTheme = context.globals.theme || "dark";

      // Set data-theme on the preview iframe's <html> so body bg responds
      useEffect(() => {
        const theme =
          selectedTheme === "side-by-side" ? "light" : selectedTheme;
        document.documentElement.setAttribute("data-theme", theme);
      }, [selectedTheme]);

      if (selectedTheme === "side-by-side") {
        return createElement(
          "div",
          { style: { display: "flex", gap: "1rem" } },
          createElement(
            "div",
            {
              "data-theme": "light",
              style: {
                flex: 1,
                padding: "1rem",
                backgroundColor: "var(--color-background)",
                // Re-declare color on the panel: inherited text colors arrive
                // as resolved values from the (light) root context in
                // side-by-side mode; re-resolving var() here makes the panel's
                // own dark tokens drive its contents.
                color: "var(--color-foreground)",
                borderRadius: "8px",
              },
            },
            createElement(
              "div",
              {
                style: {
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "var(--color-muted-foreground)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                },
              },
              "Light",
            ),
            createElement(Story, null),
          ),
          createElement(
            "div",
            {
              "data-theme": "dark",
              style: {
                flex: 1,
                padding: "1rem",
                backgroundColor: "var(--color-background)",
                // Re-declare color on the panel: inherited text colors arrive
                // as resolved values from the (light) root context in
                // side-by-side mode; re-resolving var() here makes the panel's
                // own dark tokens drive its contents.
                color: "var(--color-foreground)",
                borderRadius: "8px",
              },
            },
            createElement(
              "div",
              {
                style: {
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "var(--color-muted-foreground)",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                },
              },
              "Dark",
            ),
            createElement(Story, null),
          ),
        );
      }

      return createElement(
        "div",
        { "data-theme": selectedTheme },
        createElement(Story, null),
      );
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundation",
          [
            //
            "Logo",
            "Colors",
            "*",
          ],
          "Components",
          [
            //
            "Heading",
            "Prose",
            "Icon",
            "IconButton",
            "IconButtonLink",
            "IconButtonToggle",
            "Button",
            "ButtonLink",
            "*",
          ],
          "Compositions",
          "*",
        ],
      },
    },
    docs: {
      // Bare MDX pages (Introduction, Foundation) follow the Theme toolbar
      // via DocsThemeContainer; the default DocsContainer inside it supplies
      // the styled-components context the docs blocks rely on.
      container: ({ children, context }: { children: React.ReactNode; context: { channel: { on: Function; off: Function } } }) =>
        createElement(DocsThemeContainer, { channel: context.channel, context }, children),
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: { width: "375px", height: "812px" },
        },
        tablet: {
          name: "Tablet",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },
  },
};

export default preview;
