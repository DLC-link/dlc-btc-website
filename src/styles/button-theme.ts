import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const basestyle = defineStyle({
  justifyContent: "center",
  color: "white",
});

const action = defineStyle({
  py: "10px",
  px: "25px",
  h: "50px",
  w: "100%",
  fontSize: "lg",
  fontWeight: "extrabold",
  bg: "none",
  border: "1px solid",
  borderColor: "accent.01",
  _hover: {
    bg: "accent.01",
  },
});

const account = defineStyle({
  py: "10px",
  px: "50px",
  h: "50px",
  w: "100%",
  fontSize: "lg",
  fontWeight: "extrabold",
  bgSize: "400%",
  bgPosition: "left",
  bgGradient: "linear(to-r, accent.01, accent.02, accent.02, accent.01)",
  transition: "background-position 500ms ease, color 500ms ease",
  _hover: {
    bgPosition: "right",
  },
});

const tab = defineStyle({
  py: "25px",
  px: "0px",
  h: "50px",
  w: "auto",
  fontSize: "lg",
  fontWeight: "normal",
  bgColor: "none",
  borderBottom: "3.5px solid",
  borderRadius: "none",
  borderColor: "accent.01",
});

const company = defineStyle({
  p: "0px",
  h: "50px",
  w: "auto",
  bgColor: "none",
});

const wallet = defineStyle({
  bgColor: "background.02",
  border: "0.5px solid",
  borderColor: "accent.01",
  _hover: {
    bgColor: "accent.01",
  },
});

export const buttonTheme = defineStyleConfig({
  baseStyle: basestyle,
  variants: { tab, company, wallet, account, action },
});
