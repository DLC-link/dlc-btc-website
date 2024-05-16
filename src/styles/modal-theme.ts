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
    borderColor: 'border.lightBlue.01',
    borderRadius: 'md',
    backgroundColor: 'background.container.01',
    color: 'white',
    alignItems: 'center',
  },
});

const ledgerModalStyle = definePartsStyle({
  dialogContainer: {
    top: '19.5%',
  },
  dialog: {
    padding: '15px',
    fontFamily: 'Inter',
    width: '500px',
    border: '1.5px solid',
    borderColor: 'border.lightBlue.01',
    borderRadius: 'md',
    backgroundColor: 'black',
    color: 'white',
    alignItems: 'center',
  },
});

const variants = {
  ledger: ledgerModalStyle,
};

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
  variants,
});
