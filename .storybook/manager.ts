import { addons } from "storybook/manager-api";
import { lightTheme, darkTheme } from "./theme";

addons.setConfig({
  // Dark-first: the manager chrome starts dark, matching the default
  // preview globals (see preview.ts initialGlobals).
  theme: darkTheme,
});

addons.register("cytario-theme-switcher", (api) => {
  const channel = addons.getChannel();

  channel.on("globalsUpdated", ({ globals }: { globals: Record<string, string> }) => {
    if (globals.theme === "dark") {
      api.setOptions({ theme: darkTheme });
    } else {
      api.setOptions({ theme: lightTheme });
    }
  });
});
