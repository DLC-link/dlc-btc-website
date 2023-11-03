import { extendTheme } from '@chakra-ui/react';
import { menuTheme } from './menuTheme';
import { buttonTheme } from './buttonTheme';
import { modalTheme } from './modalTheme';
import { selectTheme } from './selectTheme';

export const appTheme = extendTheme({
  components: {
    Menu: menuTheme,
    Button: buttonTheme,
    Modal: modalTheme,
    Select: selectTheme,
  },
  styles: {
    global: () => ({
      body: {
        bgGradient: 'linear(to-r, background.01, background.02)',
      },
    }),
  },
  colors: {
    'primary.01': '#93009E',
    'primary.02': '#001FBA',
    'secondary.01': '#04BAB2',
    'secondary.02': '#2C039E',
    'background.01': '#500056',
    'background.02': '#000933',
    'background.03': '#80000000',
    'accent.01': '#07E8D8',
    'warning.01': '#FF4500',
  },

  fonts: {
    body: "'Poppins', poppins",
  },
});
