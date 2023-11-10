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
    w: "100%",
    fontSize: "lg",
    fontWeight: "extrabold",
    color: "white",
    bgColor: "none",
    border: "1px solid",
    borderRadius: "md",
    borderColor: "secondary.01",
    _hover: {
      bg: "secondary.01",
    },
  },
  list: {
    py: "10px",
    px: "5px",
    h: "auto",
    w: "275px",
    bgColor: "background.02",
    border: "1px solid",
    borderRadius: "md",
    borderColor: "secondary.01",
  },
  item: {
    justifyContent: "center",
    p: "10px",
    h: "50px",
    w: "100%",
    fontSize: "sm",
    fontWeight: "extrabold",
    color: "white",
    bgColor: "inherit",
    borderRadius: "md",
    _hover: {
      bgColor: "secondary.01",
    },
  },
});

const network = definePartsStyle({
  button: {
    padding: "10px",
    height: "50px",
    width: "275px",
    shadow: "xl",
    border: "1.5px solid",
    borderColor: "secondary.01",
    borderRadius: "md",
    background: "background.02",
    color: "white",
    fontSize: "sm",
    fontWeight: "extrabold",
    justifyContent: "center",
    _hover: {
      background: "secondary.01",
    },
  },
  list: {
    padding: "10px",
    borderTop: "0px",
    borderTopRadius: "0px",
    borderLeft: "1.5px solid",
    borderRight: "1.5px solid",
    borderBottom: "1.5px solid",
    borderColor: "secondary.01",
    borderRadius: "md",
    width: "275px",
    background: "background.02",
    shadow: "none",
  },
  item: {
    backgroundColor: "inherit",
    color: "white",
    borderRadius: "md",
    fontSize: "xs",
    fontWeight: "extrabold",
    padding: "10px",
    justifyContent: "center",
    _hover: {
      background: "secondary.01",
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
