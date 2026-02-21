import { create } from "storybook/theming/create";

export default create({
  base: "light",

  // Brand
  brandTitle: "cytario design system",
  brandUrl: "#",
  brandImage: "assets/logos/cytario-logo-reduced.svg",
  brandTarget: "_self",

  // Colors
  colorPrimary: "#5c2483",
  colorSecondary: "#5c2483",

  // UI
  appBg: "#f9fafb",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: "#e5e7eb",
  appBorderRadius: 8,

  // Text
  textColor: "#111827",
  textInverseColor: "#ffffff",
  textMutedColor: "#6b7280",

  // Toolbar
  barTextColor: "#6b7280",
  barSelectedColor: "#5c2483",
  barHoverColor: "#5c2483",
  barBg: "#ffffff",

  // Form
  inputBg: "#ffffff",
  inputBorder: "#e5e7eb",
  inputTextColor: "#111827",
  inputBorderRadius: 4,

  // Booleans
  booleanBg: "#f3f4f6",
  booleanSelectedBg: "#5c2483",

  // Grid
  gridCellSize: 8,
});
