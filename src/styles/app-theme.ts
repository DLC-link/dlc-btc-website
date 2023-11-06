import { extendTheme } from "@chakra-ui/react";
import { menuTheme } from "./menu-theme";
import { buttonTheme } from "./button-theme";
import { modalTheme } from "./modal-theme";
import { selectTheme } from "./select-theme";
import { textTheme } from "./text-theme";

export const appTheme = extendTheme({
  components: {
    Menu: menuTheme,
    Button: buttonTheme,
    Modal: modalTheme,
    Select: selectTheme,
    Text: textTheme,
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
    "primary.02": "#001FBA",
    "secondary.01": "#04BAB2",
    "secondary.02": "#2C039E",
    "background.01": "#500056",
    "background.02": "#000933",
    "background.03": "#80000000",
    "accent.01": "#07E8D8",
    "warning.01": "#FF4500",
  },

  fonts: {
    body: "'Poppins', poppins",
  },
});
