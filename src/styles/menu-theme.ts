import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  menuAnatomy.keys
);

const account = defineStyle({
  button: {
    justifyContent: 'center',
    py: '10px',
    px: '0px',
    h: '50px',
    w: '275px',
    fontSize: 'lg',
    fontWeight: 800,
    color: 'white',
    bg: 'background.container.01',
    border: '1px solid',
    borderRadius: 'md',
    borderColor: 'white.03',
    _hover: {
      bg: 'pink.01',
    },
  },
  list: {
    p: '10px',
    w: '275px',
    bgColor: 'background.container.01',
    border: '1.5px solid',
    borderColor: 'border.white.01',
    borderRadius: 'md',
  },
  item: {
    justifyContent: 'center',
    bgColor: 'inherit',
    borderRadius: 'md',
    color: 'white',
    fontSize: 'xs',
    fontWeight: 400,
    _hover: {
      background: 'white.03',
    },
    transition: 'all 0.05s ease-in-out',
  },
});

const networkChange = defineStyle({
  button: {
    justifyContent: 'center',
    py: '10px',
    px: '0px',
    h: '50px',
    w: '175px',
    fontSize: 'sm',
    fontWeight: 800,
    color: 'white',
    bg: 'background.container.01',
    border: '1px solid',
    borderRadius: 'md',
    borderColor: 'white.03',
    _hover: {
      bg: 'pink.01',
    },
  },
  list: {
    p: '10px',
    w: '175px',
    minW: '100px',
    bgColor: 'background.container.01',
    border: '1.5px solid',
    borderColor: 'border.white.01',
    borderRadius: 'md',
  },
  item: {
    justifyContent: 'center',
    bgColor: 'inherit',
    borderRadius: 'md',
    color: 'white',
    fontSize: 'xs',
    fontWeight: 400,
    _hover: {
      background: 'white.03',
    },
    transition: 'all 0.05s ease-in-out',
  },
});

const network = definePartsStyle({
  button: {
    justifyContent: 'center',
    p: '10px',
    h: '50px',
    w: '275px',
    bg: 'background.content.01',
    border: '1.5px solid',
    borderColor: 'border.white.01',
    borderRadius: 'md',
    color: 'white',
    fontSize: 'sm',
    fontWeight: 600,
    _hover: {
      background: 'white.03',
    },
  },
  list: {
    p: '10px',
    w: '275px',
    bgColor: 'background.container.01',
    border: '1.5px solid',
    borderColor: 'border.white.01',
    borderRadius: 'md',
  },
  item: {
    justifyContent: 'center',
    bgColor: 'inherit',
    borderRadius: 'md',
    color: 'white',
    fontSize: 'xs',
    fontWeight: 400,
    _hover: {
      background: 'white.03',
    },
    transition: 'all 0.05s ease-in-out',
  },
});

const ledgerAddress = definePartsStyle({
  button: {
    justifyContent: 'center',
    p: '10px',
    h: '50px',
    w: '375px',
    bg: 'background.content.01',
    border: '1.5px solid',
    borderColor: 'border.white.01',
    borderRadius: 'md',
    color: 'white',
    fontSize: 'sm',
    fontWeight: 600,
    _hover: {
      background: 'white.03',
    },
  },
  list: {
    p: '10px',
    w: '375px',
    bgColor: 'background.container.01',
    border: '1.5px solid',
    borderColor: 'border.white.01',
    borderRadius: 'md',
  },
  item: {
    justifyContent: 'center',
    bgColor: 'inherit',
    borderRadius: 'md',
    color: 'white',
    fontSize: 'xs',
    fontWeight: 400,
    _hover: {
      background: 'white.03',
    },
    transition: 'all 0.05s ease-in-out',
  },
});

const lg = defineStyle({
  width: '200px',
});

const xl = defineStyle({
  width: '350px',
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
  ledgerAddress,
  networkChange,
};

export const menuTheme = defineMultiStyleConfig({ sizes, variants });
