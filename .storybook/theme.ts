import { create } from "storybook/theming/create";

const shared = {
  brandTitle: "cytario design system",
  brandUrl: "#",
  brandTarget: "_self" as const,
  appBorderRadius: 8,
  inputBorderRadius: 4,
  gridCellSize: 8,
};

export const lightTheme = create({
  ...shared,
  base: "light",
  brandImage: "assets/logos/cytario-logo-reduced.svg",

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
  brandImage: "assets/logos/cytario-logo-reduced-inverse.svg",

  colorPrimary: "#9b4fcb",
  colorSecondary: "#9b4fcb",

  appBg: "#111827",
  appContentBg: "#1f2937",
  appPreviewBg: "#111827",
  appBorderColor: "#374151",

  textColor: "#f3f4f6",
  textInverseColor: "#111827",
  textMutedColor: "#9ca3af",

  barTextColor: "#9ca3af",
  barSelectedColor: "#9b4fcb",
  barHoverColor: "#b87ddb",
  barBg: "#1f2937",

  inputBg: "#374151",
  inputBorder: "#4b5563",
  inputTextColor: "#f3f4f6",

  booleanBg: "#374151",
  booleanSelectedBg: "#9b4fcb",
});

export default lightTheme;
