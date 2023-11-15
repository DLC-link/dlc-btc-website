import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const account = defineStyle({
  button: {
    justifyContent: "center",
    py: "10px",
    px: "0px",
    h: "50px",
    w: "275px",
    fontSize: "lg",
    fontWeight: "extrabold",
    color: "white",
    bgGradient: "linear(to-b, background.content.01, background.content.02)",
    border: "1px solid",
    borderRadius: "md",
    borderColor: "border.cyan.01",
    _hover: {
      bg: "accent.cyan.01",
    },
  },
  list: {
    p: "10px",
    w: "275px",
    bgColor: "background.container.01",
    border: "1.5px solid",
    borderColor: "border.white.01",
    borderRadius: "md",
  },
  item: {
    justifyContent: "center",
    bgColor: "inherit",
    borderRadius: "md",
    color: "white",
    fontSize: "xs",
    fontWeight: "extrabold",
    _hover: {
      background: "white.03",
    },
    transition: "all 0.05s ease-in-out",
  },
});

const network = definePartsStyle({
  button: {
    justifyContent: "center",
    p: "10px",
    h: "50px",
    w: "275px",
    bgGradient: "linear(to-b, background.content.01, background.content.02)",
    border: "1.5px solid",
    borderColor: "border.white.01",
    borderRadius: "md",
    color: "white",
    fontSize: "sm",
    fontWeight: "extrabold",
    _hover: {
      background: "white.03",
    },
  },
  list: {
    p: "10px",
    w: "275px",
    bgColor: "background.container.01",
    border: "1.5px solid",
    borderColor: "border.white.01",
    borderRadius: "md",
  },
  item: {
    justifyContent: "center",
    bgColor: "inherit",
    borderRadius: "md",
    color: "white",
    fontSize: "xs",
    fontWeight: "extrabold",
    _hover: {
      background: "white.03",
    },
    transition: "all 0.05s ease-in-out",
  },
});

const lg = defineStyle({
  width: "200px",
});

const xl = defineStyle({
  width: "350px",
});

// define custom sizes
const sizes = {
  // apply custom styles to parts
  xl: definePartsStyle({ button: xl, item: xl, groupTitle: xl, command: xl }),
  lg: definePartsStyle({ button: lg, item: lg, groupTitle: lg, command: lg }),
};

const variants = {
  network,
  account,
};

export const menuTheme = defineMultiStyleConfig({ sizes, variants });
