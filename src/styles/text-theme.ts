import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const header = defineStyle({
  color: 'white',
  fontSize: 'sm',
  fontWeight: 400,
});

const welcome = defineStyle({
  color: 'white',
  fontSize: '4xl',
  whiteSpace: 'pre-line',
});

const navigate = defineStyle({
  color: 'accent.cyan.01',
  fontSize: 'lg',
  fontWeight: 'regular',
  textDecoration: 'underline',
  _hover: {
    cursor: 'pointer',
  },
});

export const textTheme = defineStyleConfig({
  variants: { header, welcome, navigate },
});
