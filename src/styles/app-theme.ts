import { extendTheme } from "@chakra-ui/react";

import { buttonTheme } from "./button-theme";
import { menuTheme } from "./menu-theme";
import { modalTheme } from "./modal-theme";
import { selectTheme } from "./select-theme";
import { tabsTheme } from "./tabs-theme";
import { textTheme } from "./text-theme";

export const appTheme = extendTheme({
  components: {
    Menu: menuTheme,
    Button: buttonTheme,
    Modal: modalTheme,
    Select: selectTheme,
    Text: textTheme,
    Tabs: tabsTheme,
    Progress: {
      baseStyle: {
        filledTrack: {
          bg: "accent.01",
        },
      },
    },
  },
  styles: {
    global: () => ({
      body: {
        bgGradient: "linear(to-r, background.01, background.02)",
      },
    }),
  },
  colors: {
    "background.01": "rgba(50,3,69,1)",
    "background.02": "rgba(0,9,51,1)",
    "background.03": "rgba(40,7,78,1)",
    "background.04": "rgba(31,9,78,0.25)",
    "background.05": "rgba(4,13,72,0.25)",
    "accent.01": "rgba(7,232,216,1)",
    "accent.02": "rgba(0,40,187,1)",
    "accent.03": "rgba(7,232,216,0.75)",
    "accent.04": "rgba(247,147,26,1)",
    "white.01": "rgba(255,255,255,1)",
    "white.02": "rgba(255,255,255,0.75)",
    "white.03": "rgba(255,255,255,0.35)",
    "white.04": "rgba(255,255,255,0.25)",
  },
  fonts: {
    body: "'Poppins', poppins",
  },
});
