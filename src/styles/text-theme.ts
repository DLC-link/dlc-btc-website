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
  color: 'accent.lightBlue.01',
  fontSize: 'lg',
  fontWeight: 'regular',
  textDecoration: 'underline',
  _hover: {
    cursor: 'pointer',
  },
});

const step = defineStyle({
  color: 'accent.lightBlue.01',
  fontSize: 'lg',
  fontWeight: 'regular',
});

const title = defineStyle({
  color: 'white',
  fontSize: '2xl',
  fontWeight: 'bold',
});

const subTitle = defineStyle({
  color: 'white',
  fontSize: 'lg',
  fontWeight: 'bold',
});

export const textTheme = defineStyleConfig({
  variants: { header, welcome, navigate, step, title, subTitle },
});
