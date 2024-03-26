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
  borderColor: 'accent.lightBlue.01',
  _hover: {
    bg: 'accent.lightBlue.01',
  },
});

const navigate = defineStyle({
  py: '10px',
  px: '25px',
  h: '50px',
  w: '100%',
  fontSize: 'lg',
  fontWeight: 600,
  bg: 'none',
  border: '1px solid',
  borderColor: 'accent.lightBlue.01',
  _hover: {
    bg: 'accent.lightBlue.01',
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
  bg: 'accent.lightBlue.01',
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
  borderColor: 'accent.lightBlue.01',
});

const company = defineStyle({
  p: '0px',
  h: '50px',
  w: 'auto',
  bgColor: 'none',
});

const wallet = defineStyle({
  p: '10px',
  h: '50px',
  w: '275px',
  bg: 'background.content.01',
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
