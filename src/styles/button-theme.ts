import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const basestyle = defineStyle({
  justifyContent: 'center',
  color: 'white',
});

const vault = defineStyle({
  py: '10px',
  px: '25px',
  h: '35px',
  w: '100%',
  fontSize: 'sm',
  fontWeight: 'normal',
  bg: 'none',
  border: '1px solid',
  borderColor: 'accent.cyan.01',
  _hover: {
    bg: 'accent.cyan.01',
  },
});

const navigate = defineStyle({
  py: '10px',
  px: '25px',
  h: '50px',
  w: '100%',
  fontSize: 'sm',
  fontWeight: 600,
  bg: 'none',
  border: '1px solid',
  borderColor: 'accent.cyan.01',
  _hover: {
    bg: 'accent.cyan.01',
  },
});

const account = defineStyle({
  py: '10px',
  px: '50px',
  h: '50px',
  w: '100%',
  fontSize: 'lg',
  fontWeight: 600,
  bgSize: '400%',
  bgPosition: 'left',
  bgGradient: 'linear(to-r, accent.cyan.01, accent.blue.01, accent.blue.01, accent.cyan.01)',
  transition: 'background-position 500ms ease, color 500ms ease',
  _hover: {
    bgPosition: 'right',
  },
});

const tab = defineStyle({
  py: '25px',
  px: '0px',
  h: '50px',
  w: 'auto',
  fontSize: 'lg',
  fontWeight: 400,
  bgColor: 'none',
  borderBottom: '3.5px solid',
  borderRadius: 'none',
  borderColor: 'accent.cyan.01',
});

const company = defineStyle({
  p: '0px',
  h: '50px',
  w: 'auto',
  bgColor: 'none',
});

const wallet = defineStyle({
  bgGradient: 'linear(to-b, background.content.01, background.content.02)',
  border: '0.5px solid',
  borderColor: 'border.white.01',
  _hover: {
    bgColor: 'white.03',
  },
});

export const buttonTheme = defineStyleConfig({
  baseStyle: basestyle,
  variants: { tab, company, wallet, account, vault, navigate },
});
