import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const header = defineStyle({
  padding: "10px",
  fontWeight: "extrabold",
  fontSize: "sm",
  color: "white",
});

export const textTheme = defineStyleConfig({ variants: { header } });
