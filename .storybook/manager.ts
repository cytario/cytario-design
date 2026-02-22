import { addons } from "storybook/manager-api";
import { lightTheme, darkTheme } from "./theme";

addons.setConfig({
  theme: lightTheme,
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
