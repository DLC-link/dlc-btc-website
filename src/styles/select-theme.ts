import { selectAnatomy } from "@chakra-ui/anatomy";
import { defineStyle, createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    borderRadius: "md",
    background: "none",
    color: "white",
  },
  icon: {
    color: "secondary.01",
  },
});

const md = defineStyle({
  fontSize: "sm",
  height: "50px",
  width: "200px",
});

const sizes = {
  md: definePartsStyle({ field: md }),
};

export const selectTheme = defineMultiStyleConfig({ baseStyle, sizes });
