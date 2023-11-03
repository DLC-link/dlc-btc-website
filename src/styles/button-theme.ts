import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const tab = defineStyle({
  paddingX: '0px',
  paddingY: '10px',
  height: '50px',
  width: 'auto',
  background: 'none',
  color: 'white',
  fontSize: 'lg',
  fontWeight: 'normal',
  borderBottom: '3.5px solid',
  borderColor: 'secondary.01',
});

const company = defineStyle({
  padding: '0px',
  height: '50px',
  width: '50px',
  background: 'none',
});

const wallet = defineStyle({
    padding: '10px',
    height: '50px',
    width: '275px',
    shadow: 'xl',
    border: '1.5px solid',
    borderColor: 'secondary.01',
    borderRadius: 'md',
    background: 'none',
    color: 'white',
    fontSize: 'sm',
    fontWeight: 'extrabold',
    justifyContent: 'center',
    _hover: {
      background: 'secondary.01',
    },
  });

export const buttonTheme = defineStyleConfig({ variants: { tab, company, wallet } });
