import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const thick = defineStyle({
  borderWidth: '3.5px',
  borderStyle: 'solid',
  borderColor: 'border.white.01',
});

const thickDotted = defineStyle({
  borderWidth: '3.5px',
  borderStyle: 'dotted',
  borderColor: 'border.white.01',
});

export const dividerTheme = defineStyleConfig({
  variants: { thick, thickDotted },
});
