import { createElement } from "react";
import type { Preview } from "storybook/react";
import "../src/styles/global.css";
import theme from "./theme";

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
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      const selectedTheme = context.globals.theme || "light";

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
                backgroundColor: "var(--color-surface-default)",
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
                  color: "var(--color-text-secondary)",
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
                backgroundColor: "var(--color-surface-default)",
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
                  color: "var(--color-text-secondary)",
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
    docs: {
      theme,
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
