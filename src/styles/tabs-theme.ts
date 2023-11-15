import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  root: {
    p: "10px",
    h: "150px",
    w: "100%",
  },
  tab: {
    w: "50%",
    color: "white",
    fontSize: "lg",
    fontWeight: "semibold",
    _selected: {
      color: "accent.cyan.01",
    },
  },
  tabpanel: {
    p: "0px",
  },
});

// export the component theme
export const tabsTheme = defineMultiStyleConfig({ baseStyle });
