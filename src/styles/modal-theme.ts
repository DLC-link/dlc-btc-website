import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  dialogContainer: {
    top: '19.5%',
  },
  dialog: {
    padding: '15px',
    width: '350px',
    border: '1.5px solid',
    borderColor: 'border.cyan.01',
    borderRadius: 'md',
    backgroundColor: 'background.container.01',
    color: 'white',
    alignItems: 'center',
  },
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
});
