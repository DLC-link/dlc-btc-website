import { extendTheme } from "@chakra-ui/react";
import { menuTheme } from "./menu-theme";
import { buttonTheme } from "./button-theme";
import { modalTheme } from "./modal-theme";
import { selectTheme } from "./select-theme";
import { textTheme } from "./text-theme";
import { tabsTheme } from "./tabs-theme";

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
          bg: "secondary.01",
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
    "primary.01": "#93009E",
    "primary.02": "#93009E",
    "secondary.01": "#07E8D8",
    "secondary.02": "#001FBA",
    "background.01": "#3a0248",
    "background.02": "#000933",
    "background.03": "#80000000",
    "background.04": "#350058",
    "accent.01": "#07E8D8",
    "accent.02": "#FFA800",
    "warning.01": "#FF4500",
  },

  fonts: {
    body: "'Poppins', poppins",
  },
});
