import { create } from "storybook/theming/create";

const shared = {
  brandTitle: "cytario design system",
  brandUrl: "#",
  brandTarget: "_self" as const,
  fontBase: '"Montserrat", system-ui, sans-serif',
  fontCode: "monospace",
  appBorderRadius: 8,
  inputBorderRadius: 4,
  gridCellSize: 8,
};

export const lightTheme = create({
  ...shared,
  base: "light",
  brandImage: "assets/logos/cytario-logo-purple.svg",

  colorPrimary: "#5c2483",
  colorSecondary: "#5c2483",

  appBg: "#f9fafb",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: "#e5e7eb",

  textColor: "#111827",
  textInverseColor: "#ffffff",
  textMutedColor: "#6b7280",

  barTextColor: "#6b7280",
  barSelectedColor: "#5c2483",
  barHoverColor: "#5c2483",
  barBg: "#ffffff",

  inputBg: "#ffffff",
  inputBorder: "#e5e7eb",
  inputTextColor: "#111827",

  booleanBg: "#f3f4f6",
  booleanSelectedBg: "#5c2483",
});

export const darkTheme = create({
  ...shared,
  base: "dark",
  brandImage: "assets/logos/cytario-logo-white.svg",

  colorPrimary: "#b87ddb",
  colorSecondary: "#b87ddb",

  // Chrome surfaces follow the dusk ramp (the brand palette) instead of
  // Storybook's default slate: appBg = dusk-950 (deepest), appContentBg /
  // appPreviewBg = dusk-900 (the brand canvas #160a24), barBg = dusk-800.
  // Border/input tones use dusk-600/dusk-500; brand-text purple carries
  // selection.
  appBg: "#0e041d",
  appContentBg: "#160a24",
  appPreviewBg: "#160a24",
  appBorderColor: "#4c4161",

  textColor: "#f5f3fa",
  textInverseColor: "#160a24",
  textMutedColor: "#a499bb",

  barTextColor: "#a499bb",
  barSelectedColor: "#b87ddb",
  barHoverColor: "#d4b3eb",
  barBg: "#1d1032",

  inputBg: "#251543",
  inputBorder: "#4c4161",
  inputTextColor: "#f5f3fa",

  booleanBg: "#251543",
  booleanSelectedBg: "#b87ddb",
});

export default lightTheme;
