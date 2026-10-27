import type { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
  stories: [
    "../src/docs/**/*.mdx",
    "../src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  features: {
    // Off for a published design-system portal: no onboarding checklist, no
    // "what's new in Storybook x.y" toast — visitors are consumers, not new
    // Storybook users. (The checklist key is sidebarOnboardingChecklist; the
    // toast is additionally gated by core.disableWhatsNewNotifications.)
    sidebarOnboardingChecklist: false,
  },
  core: {
    disableWhatsNewNotifications: true,
  },
  viteFinal: async (config) => {
    const tailwindcss = await import("@tailwindcss/vite");
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss.default());
    return config;
  },
  docs: {},
  staticDirs: ["../assets"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
