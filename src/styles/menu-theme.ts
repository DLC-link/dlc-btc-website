import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  menuAnatomy.keys
);

const baseStyle = definePartsStyle({
  button: {
    padding: '10px',
    height: '50px',
    width: '200px',
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
  },
  list: {
    padding: '10px',
    borderRadius: 'md',
    width: '200px',
    background: 'primary.01',
    shadow: 'xl',
  },
  item: {
    color: 'white',
    fontSize: 'sm',
    fontWeight: 'extrabold',
    padding: '10px',
    justifyContent: 'center',
    _hover: {
      background: 'accent.01',
    },
  },
});

const wallet = definePartsStyle({
  button: {
    padding: '10px',
    height: '50px',
    width: '300px',
    shadow: 'none',
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
  },
  list: {
    padding: '10px',
    borderTop: '0px',
    borderTopRadius: '0px',
    borderLeft: '1.5px solid',
    borderRight: '1.5px solid',
    borderBottom: '1.5px solid',
    borderColor: 'secondary.01',
    borderRadius: 'md',
    width: '300px',
    background: 'background.02',
    shadow: 'none',
  },
  item: {
    backgroundColor: 'inherit',
    color: 'white',
    borderRadius: 'md',
    fontSize: 'sm',
    fontWeight: 'extrabold',
    padding: '10px',
    justifyContent: 'center',
    _hover: {
      background: 'accent.01',
    },
  },
});

const xl = defineStyle({
  width: '350px',
});

// define custom sizes
const sizes = {
  // apply custom styles to parts
  xl: definePartsStyle({ button: xl, item: xl, groupTitle: xl, command: xl }),
};

const variants = {
  wallet,
};

export const menuTheme = defineMultiStyleConfig({ baseStyle, sizes, variants });
